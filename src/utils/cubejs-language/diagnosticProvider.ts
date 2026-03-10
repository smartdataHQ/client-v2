/**
 * Diagnostic provider for Cube.js model files.
 *
 * Validates parsed documents against the schema spec, producing
 * DiagnosticItem[] arrays that can be mapped to Monaco editor markers.
 *
 * Design:
 *   - validateDocument() is a pure function for testing
 *   - mapBackendErrors() converts backend ValidationError[] to DiagnosticItem[]
 *   - createDiagnosticProvider() creates the runtime Monaco integration
 */
import type {
  ParsedDocument,
  ParsedCube,
  ParsedView,
  ParsedMember,
  ParsedProperty,
  SchemaSpec,
  ConstructSpec,
  PropertySpec,
  MemberTypeSpec,
  ValidationError,
  MonacoRange,
} from "./types";

// ---------------------------------------------------------------------------
// DiagnosticItem — Monaco-independent diagnostic representation
// ---------------------------------------------------------------------------

export interface DiagnosticItem {
  severity: "error" | "warning";
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the property key name appropriate for the document format.
 * YAML uses snake_case (yamlKey), JS uses camelCase (jsKey).
 */
function getKeyForFormat(prop: PropertySpec, format: "yaml" | "js"): string {
  return format === "yaml" ? prop.yamlKey : prop.jsKey;
}

/**
 * Build a lookup map from format-appropriate key to PropertySpec.
 */
function buildKeyMap(
  properties: Record<string, PropertySpec>,
  format: "yaml" | "js"
): Map<string, PropertySpec> {
  const map = new Map<string, PropertySpec>();
  for (const spec of Object.values(properties)) {
    map.set(getKeyForFormat(spec, format), spec);
  }
  return map;
}

/**
 * Get sorted list of valid key names for a property set in the given format.
 */
function validKeyNames(
  properties: Record<string, PropertySpec>,
  format: "yaml" | "js"
): string[] {
  return Object.values(properties)
    .map((spec) => getKeyForFormat(spec, format))
    .sort();
}

/**
 * Create a diagnostic from a MonacoRange.
 */
function diag(
  severity: "error" | "warning",
  message: string,
  range: MonacoRange
): DiagnosticItem {
  return {
    severity,
    message,
    startLineNumber: range.startLineNumber,
    startColumn: range.startColumn,
    endLineNumber: range.endLineNumber,
    endColumn: range.endColumn,
  };
}

// ---------------------------------------------------------------------------
// Member group key mapping
// ---------------------------------------------------------------------------

/**
 * Map from the key used in the parsed document (format-sensitive) to the
 * canonical memberType key used in ConstructSpec.memberTypes.
 *
 * YAML documents use snake_case keys (e.g. "pre_aggregations"),
 * JS documents use camelCase keys (e.g. "preAggregations").
 * The spec memberTypes always uses camelCase keys.
 */
function canonicalMemberType(key: string): string {
  // Handle the snake_case → camelCase mapping for pre_aggregations
  if (key === "pre_aggregations") return "preAggregations";
  return key;
}

// ---------------------------------------------------------------------------
// Core validation
// ---------------------------------------------------------------------------

/**
 * Validate a parsed document against the schema spec.
 * Returns an array of DiagnosticItem for all issues found.
 *
 * This is a pure function — no Monaco dependency.
 */
export function validateDocument(
  doc: ParsedDocument,
  spec: SchemaSpec
): DiagnosticItem[] {
  const diagnostics: DiagnosticItem[] = [];
  const format = doc.format;

  // Validate cubes
  for (const cube of doc.cubes) {
    const constructSpec = spec.constructs.cube;
    if (constructSpec) {
      validateConstruct(cube, constructSpec, format, diagnostics);
    }
  }

  // Validate views
  for (const view of doc.views) {
    const constructSpec = spec.constructs.view;
    if (constructSpec) {
      validateConstruct(view, constructSpec, format, diagnostics);
    }
  }

  return diagnostics;
}

/**
 * Validate a single cube or view construct.
 */
function validateConstruct(
  construct: ParsedCube | ParsedView,
  constructSpec: ConstructSpec,
  format: "yaml" | "js",
  diagnostics: DiagnosticItem[]
): void {
  // Build a key map for top-level properties
  const topLevelKeyMap = buildKeyMap(constructSpec.properties, format);

  // Also build a set of member group keys in the appropriate format
  const memberGroupKeys = new Set<string>();
  for (const spec of Object.values(constructSpec.properties)) {
    const key = getKeyForFormat(spec, format);
    // Member groups are object-type properties that have corresponding memberTypes
    const canonical = canonicalMemberType(key);
    if (
      constructSpec.memberTypes[canonical] ||
      constructSpec.memberTypes[key]
    ) {
      memberGroupKeys.add(key);
    }
  }

  // Check top-level properties
  for (const prop of construct.properties) {
    const propSpec = topLevelKeyMap.get(prop.key);

    if (!propSpec) {
      // Unknown property — skip member group keys (they appear in construct.members, not properties)
      if (!memberGroupKeys.has(prop.key)) {
        const validKeys = validKeyNames(constructSpec.properties, format);
        diagnostics.push(
          diag(
            "error",
            `Unknown property '${prop.key}'. Valid properties: ${validKeys.join(
              ", "
            )}`,
            prop.range
          )
        );
      }
      continue;
    }

    // Check deprecated
    if (propSpec.deprecated) {
      const replacement = propSpec.deprecatedBy
        ? getKeyForFormat(
            findSpecByCanonicalKey(
              constructSpec.properties,
              propSpec.deprecatedBy
            ),
            format
          ) ?? propSpec.deprecatedBy
        : undefined;
      const msg = replacement
        ? `'${prop.key}' is deprecated, use '${replacement}' instead`
        : `'${prop.key}' is deprecated`;
      diagnostics.push(diag("warning", msg, prop.range));
    }

    // Check enum values
    if (propSpec.type === "enum" && propSpec.values && prop.value != null) {
      const strValue = String(prop.value);
      if (!propSpec.values.includes(strValue)) {
        diagnostics.push(
          diag(
            "error",
            `Invalid value '${strValue}' for '${
              prop.key
            }'. Valid values: ${propSpec.values.join(", ")}`,
            prop.valueRange
          )
        );
      }
    }
  }

  // Check required top-level properties
  // Skip "name" — it is structural (extracted from the construct definition itself, not a regular property)
  checkRequiredProperties(
    construct.properties,
    constructSpec.properties,
    format,
    construct.nameRange,
    diagnostics,
    new Set(["name"])
  );

  // Validate member groups
  for (const [memberGroupKey, memberList] of Object.entries(
    construct.members
  )) {
    const canonical = canonicalMemberType(memberGroupKey);
    const memberTypeSpec =
      constructSpec.memberTypes[canonical] ??
      constructSpec.memberTypes[memberGroupKey];

    if (!memberTypeSpec) continue;

    for (const member of memberList) {
      validateMember(member, memberTypeSpec, format, diagnostics);
    }
  }
}

/**
 * Find a PropertySpec by its canonical (JS) key, returning it or a fallback.
 */
function findSpecByCanonicalKey(
  properties: Record<string, PropertySpec>,
  canonicalKey: string
): PropertySpec {
  // The canonical key is the jsKey
  const spec = properties[canonicalKey];
  if (spec) return spec;
  // Fallback: search by jsKey
  for (const s of Object.values(properties)) {
    if (s.jsKey === canonicalKey) return s;
  }
  // Return a stub
  return {
    key: canonicalKey,
    jsKey: canonicalKey,
    yamlKey: canonicalKey,
    type: "string",
    required: false,
    description: "",
  };
}

/**
 * Validate a single member (dimension, measure, etc.).
 */
function validateMember(
  member: ParsedMember,
  memberTypeSpec: MemberTypeSpec,
  format: "yaml" | "js",
  diagnostics: DiagnosticItem[]
): void {
  const keyMap = buildKeyMap(memberTypeSpec.properties, format);

  for (const prop of member.properties) {
    // Skip "name" — it's structural, not a spec property
    if (prop.key === "name") continue;

    const propSpec = keyMap.get(prop.key);

    if (!propSpec) {
      const validKeys = validKeyNames(memberTypeSpec.properties, format);
      diagnostics.push(
        diag(
          "error",
          `Unknown property '${prop.key}'. Valid properties: ${validKeys.join(
            ", "
          )}`,
          prop.range
        )
      );
      continue;
    }

    // Check deprecated
    if (propSpec.deprecated) {
      const replacement = propSpec.deprecatedBy
        ? getKeyForFormat(
            findSpecByCanonicalKey(
              memberTypeSpec.properties,
              propSpec.deprecatedBy
            ),
            format
          ) ?? propSpec.deprecatedBy
        : undefined;
      const msg = replacement
        ? `'${prop.key}' is deprecated, use '${replacement}' instead`
        : `'${prop.key}' is deprecated`;
      diagnostics.push(diag("warning", msg, prop.range));
    }

    // Check enum values
    if (propSpec.type === "enum" && propSpec.values && prop.value != null) {
      const strValue = String(prop.value);
      if (!propSpec.values.includes(strValue)) {
        diagnostics.push(
          diag(
            "error",
            `Invalid value '${strValue}' for '${
              prop.key
            }'. Valid values: ${propSpec.values.join(", ")}`,
            prop.valueRange
          )
        );
      }
    }
  }

  // Check required member properties (excluding "name" which is structural)
  checkRequiredProperties(
    member.properties,
    memberTypeSpec.properties,
    format,
    member.nameRange,
    diagnostics
  );

  // Additional semantic validations for specific member types
  if (memberTypeSpec.name === "preAggregations") {
    validatePreAggregationSemantics(member, format, diagnostics);
  }
}

/**
 * Additional semantic validations for pre-aggregation members.
 */
function validatePreAggregationSemantics(
  member: ParsedMember,
  _format: "yaml" | "js",
  diagnostics: DiagnosticItem[]
): void {
  const propMap = new Map(member.properties.map((p) => [p.key, p]));

  // 1. rollupJoin and rollupLambda require "rollups"
  const typeProp = propMap.get("type");
  if (typeProp) {
    const typeValue = String(typeProp.value ?? "");
    if (
      (typeValue === "rollupJoin" || typeValue === "rollupLambda") &&
      !propMap.has("rollups")
    ) {
      diagnostics.push(
        diag(
          "warning",
          `Pre-aggregation type '${typeValue}' requires 'rollups' property`,
          member.nameRange
        )
      );
    }
  }

  // 2. refresh_key: immutable cannot coexist with every/sql
  // The refresh_key is a nested object. We look for its sub-properties
  // by checking if there are properties that match refresh_key children.
  const refreshKeyProp =
    propMap.get("refresh_key") ?? propMap.get("refreshKey");
  if (
    refreshKeyProp &&
    refreshKeyProp.value &&
    typeof refreshKeyProp.value === "object"
  ) {
    const rkObj = refreshKeyProp.value as Record<string, unknown>;
    const hasImmutable = rkObj.immutable !== undefined;
    const hasEvery = rkObj.every !== undefined;
    const hasSql = rkObj.sql !== undefined;
    if (hasImmutable && (hasEvery || hasSql)) {
      diagnostics.push(
        diag(
          "warning",
          "'immutable' in refresh_key cannot coexist with 'every' or 'sql'",
          refreshKeyProp.range
        )
      );
    }
  }
}

/**
 * Check that all required properties are present.
 */
function checkRequiredProperties(
  existingProps: ParsedProperty[],
  specProperties: Record<string, PropertySpec>,
  format: "yaml" | "js",
  anchorRange: MonacoRange,
  diagnostics: DiagnosticItem[],
  skipKeys?: Set<string>
): void {
  const existingKeys = new Set(existingProps.map((p) => p.key));

  for (const spec of Object.values(specProperties)) {
    if (!spec.required) continue;
    // Skip structural keys (e.g. "name" on constructs)
    if (skipKeys?.has(spec.key)) continue;
    const key = getKeyForFormat(spec, format);
    if (!existingKeys.has(key)) {
      diagnostics.push(
        diag("warning", `Missing required property '${key}'`, anchorRange)
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Backend error mapping
// ---------------------------------------------------------------------------

/**
 * Map backend ValidationError[] to DiagnosticItem[].
 */
export function mapBackendErrors(errors: ValidationError[]): DiagnosticItem[] {
  return errors.map((err) => ({
    severity: err.severity,
    message: err.message,
    startLineNumber: err.startLine,
    startColumn: err.startColumn,
    endLineNumber: err.endLine ?? err.startLine,
    endColumn: err.endColumn ?? err.startColumn,
  }));
}

// ---------------------------------------------------------------------------
// Runtime diagnostic provider (Monaco integration)
// ---------------------------------------------------------------------------

/**
 * Create a diagnostic provider that integrates with Monaco editor.
 *
 * Returns an object with:
 *   - onContentChange(model, parseDocument): debounced client-side validation
 *   - onSave(files, currentFileName): backend validation via POST
 *   - dispose(): cleanup timers
 */
export function createDiagnosticProvider(
  spec: SchemaSpec,
  options?: {
    /** Function to parse a model into a ParsedDocument. */
    parseDocument?: (content: string, format: "yaml" | "js") => ParsedDocument;
    /** Function to set markers on a Monaco model. */
    setMarkers?: (
      model: unknown,
      owner: string,
      markers: DiagnosticItem[]
    ) => void;
    /** Function to POST files for backend validation. Returns ValidationError[]. */
    validateOnBackend?: (
      files: Array<{ fileName: string; content: string }>
    ) => Promise<ValidationError[]>;
    /** Debounce delay in ms (default 300). */
    debounceMs?: number;
  }
) {
  const debounceMs = options?.debounceMs ?? 300;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function onContentChange(
    model: { getValue: () => string; uri?: { path?: string } },
    parseDocument: (content: string) => ParsedDocument
  ): void {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const content = model.getValue();
      const doc = parseDocument(content);
      const diagnostics = validateDocument(doc, spec);
      if (options?.setMarkers) {
        options.setMarkers(model, "cubejs-client", diagnostics);
      }
    }, debounceMs);
  }

  async function onSave(
    files: Array<{ fileName: string; content: string }>,
    currentFileName: string
  ): Promise<DiagnosticItem[]> {
    if (!options?.validateOnBackend) return [];
    try {
      const errors = await options.validateOnBackend(files);
      const currentFileErrors = errors.filter(
        (e) => e.fileName === currentFileName
      );
      const diagnostics = mapBackendErrors(currentFileErrors);
      return diagnostics;
    } catch {
      return [];
    }
  }

  function dispose(): void {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }

  return { onContentChange, onSave, dispose };
}
