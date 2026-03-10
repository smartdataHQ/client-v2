/**
 * Completion provider for Cube.js model files.
 *
 * Exports:
 * - `getCompletions()` — testable pure function: CursorContext → CompletionItem[]
 * - `createCompletionProvider()` — Monaco CompletionItemProvider wrapper
 */

import { cubeJsSpec, getKeyForFormat } from "./spec";
import {
  parseYamlDocument,
  getCursorContext as getYamlCursorContext,
} from "./yamlParser";
import {
  parseJsDocument,
  getCursorContext as getJsCursorContext,
} from "./jsParser";

import type { CubeRegistry } from "./registry";
import type { CursorContext, PropertySpec, MemberTypeSpec } from "./types";

// ---------------------------------------------------------------------------
// CompletionItem (testable, Monaco-independent)
// ---------------------------------------------------------------------------

export interface CompletionItem {
  label: string;
  kind: "property" | "value" | "snippet" | "reference" | "variable";
  insertText: string;
  isSnippet?: boolean;
  documentation?: string;
  detail?: string;
  sortText?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Format = "yaml" | "js";

/** Map a member group key (which may be snake_case from YAML) to the spec's camelCase key. */
function normalizeMemberType(memberType: string): string {
  if (memberType === "pre_aggregations") return "preAggregations";
  return memberType;
}

/** Look up the MemberTypeSpec for a given memberType string. */
function getMemberTypeSpec(memberType: string): MemberTypeSpec | undefined {
  const normalized = normalizeMemberType(memberType);
  return cubeJsSpec.constructs.cube.memberTypes[normalized];
}

/** Get the display key for a PropertySpec in the given format. */
function keyFor(spec: PropertySpec, format: Format): string {
  return getKeyForFormat(spec, format);
}

// ---------------------------------------------------------------------------
// getCompletions
// ---------------------------------------------------------------------------

/**
 * Pure function that returns completion items for a given cursor context.
 * No Monaco dependency — designed to be testable in isolation.
 */
export function getCompletions(
  context: CursorContext,
  format: Format,
  registry: CubeRegistry
): CompletionItem[] {
  switch (context.type) {
    case "cube_root":
      return getCubeRootCompletions(context, format);
    case "member_list":
      return getMemberListCompletions(context, format);
    case "member_body":
      return getMemberBodyCompletions(context, format);
    case "property_value":
      return getPropertyValueCompletions(context);
    case "sql":
      return getSqlCompletions(context, registry);
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// cube_root completions
// ---------------------------------------------------------------------------

function getCubeRootCompletions(
  context: Extract<CursorContext, { type: "cube_root" }>,
  format: Format
): CompletionItem[] {
  const constructSpec = cubeJsSpec.constructs[context.constructType];
  if (!constructSpec) return [];

  const items: CompletionItem[] = [];
  let sortIndex = 0;

  for (const propSpec of Object.values(constructSpec.properties)) {
    if (propSpec.deprecated) continue;
    const key = keyFor(propSpec, format);
    items.push({
      label: key,
      kind: "property",
      insertText: format === "yaml" ? `${key}: ` : `${key}: `,
      documentation: propSpec.description,
      detail: propSpec.required ? "(required)" : undefined,
      sortText: String(sortIndex++).padStart(4, "0"),
    });
  }

  return items;
}

// ---------------------------------------------------------------------------
// member_list completions (skeleton snippets)
// ---------------------------------------------------------------------------

function getMemberListCompletions(
  context: Extract<CursorContext, { type: "member_list" }>,
  format: Format
): CompletionItem[] {
  const normalized = normalizeMemberType(context.memberType);
  const items: CompletionItem[] = [];

  if (format === "yaml") {
    items.push(getYamlMemberSkeleton(normalized));
  } else {
    items.push(getJsMemberSkeleton(normalized));
  }

  return items;
}

function getYamlMemberSkeleton(memberType: string): CompletionItem {
  switch (memberType) {
    case "dimensions":
      return {
        label: "new dimension",
        kind: "snippet",
        insertText: "- name: $1\n  sql: ${CUBE}.$2\n  type: $3",
        isSnippet: true,
        documentation: "Add a new dimension",
        detail: "dimension skeleton",
      };
    case "measures":
      return {
        label: "new measure",
        kind: "snippet",
        insertText: "- name: $1\n  type: $2\n  sql: $3",
        isSnippet: true,
        documentation: "Add a new measure",
        detail: "measure skeleton",
      };
    case "joins":
      return {
        label: "new join",
        kind: "snippet",
        insertText:
          "- name: $1\n  sql: ${CUBE}.$2 = ${$3.$4}\n  relationship: $5",
        isSnippet: true,
        documentation: "Add a new join",
        detail: "join skeleton",
      };
    case "segments":
      return {
        label: "new segment",
        kind: "snippet",
        insertText: "- name: $1\n  sql: $2",
        isSnippet: true,
        documentation: "Add a new segment",
        detail: "segment skeleton",
      };
    case "preAggregations":
      return {
        label: "new pre-aggregation",
        kind: "snippet",
        insertText:
          "- name: $1\n  type: rollup\n  measures: $2\n  dimensions: $3",
        isSnippet: true,
        documentation: "Add a new pre-aggregation",
        detail: "pre-aggregation skeleton",
      };
    default:
      return {
        label: "new member",
        kind: "snippet",
        insertText: "- name: $1",
        isSnippet: true,
        documentation: "Add a new member",
      };
  }
}

function getJsMemberSkeleton(memberType: string): CompletionItem {
  switch (memberType) {
    case "dimensions":
      return {
        label: "new dimension",
        kind: "snippet",
        insertText: "$1: {\n  sql: `${CUBE}.$2`,\n  type: `$3`,\n}",
        isSnippet: true,
        documentation: "Add a new dimension",
        detail: "dimension skeleton",
      };
    case "measures":
      return {
        label: "new measure",
        kind: "snippet",
        insertText: "$1: {\n  type: `$2`,\n  sql: `$3`,\n}",
        isSnippet: true,
        documentation: "Add a new measure",
        detail: "measure skeleton",
      };
    case "joins":
      return {
        label: "new join",
        kind: "snippet",
        insertText:
          "$1: {\n  sql: `${CUBE}.$2 = ${$3.$4}`,\n  relationship: `$5`,\n}",
        isSnippet: true,
        documentation: "Add a new join",
        detail: "join skeleton",
      };
    case "segments":
      return {
        label: "new segment",
        kind: "snippet",
        insertText: "$1: {\n  sql: `$2`,\n}",
        isSnippet: true,
        documentation: "Add a new segment",
        detail: "segment skeleton",
      };
    case "preAggregations":
      return {
        label: "new pre-aggregation",
        kind: "snippet",
        insertText:
          "$1: {\n  type: `rollup`,\n  measures: $2,\n  dimensions: $3,\n}",
        isSnippet: true,
        documentation: "Add a new pre-aggregation",
        detail: "pre-aggregation skeleton",
      };
    default:
      return {
        label: "new member",
        kind: "snippet",
        insertText: "$1: {\n}",
        isSnippet: true,
        documentation: "Add a new member",
      };
  }
}

// ---------------------------------------------------------------------------
// member_body completions
// ---------------------------------------------------------------------------

function getMemberBodyCompletions(
  context: Extract<CursorContext, { type: "member_body" }>,
  format: Format
): CompletionItem[] {
  const memberTypeSpec = getMemberTypeSpec(context.memberType);
  if (!memberTypeSpec) return [];

  const existingSet = new Set(context.existingKeys);
  const items: CompletionItem[] = [];
  let sortIndex = 0;

  // Check if any existing key corresponds to a nested property context.
  // For example, if we're inside a refresh_key object within pre_aggregations,
  // one of the existingKeys will be a sub-property of refresh_key.
  // We detect this by checking if the context has a propertyKey hint (via existingKeys
  // matching children of a known parent property).
  const nestedChildren = resolveNestedChildren(
    context.existingKeys,
    memberTypeSpec
  );
  if (nestedChildren) {
    // We're inside a nested object — suggest its children instead
    for (const propSpec of Object.values(nestedChildren)) {
      if (propSpec.deprecated) continue;
      const key = keyFor(propSpec, format);
      if (existingSet.has(propSpec.jsKey) || existingSet.has(propSpec.yamlKey))
        continue;
      items.push({
        label: key,
        kind: "property",
        insertText: format === "yaml" ? `${key}: ` : `${key}: `,
        documentation: propSpec.description,
        detail: propSpec.required ? "(required)" : undefined,
        sortText: String(sortIndex++).padStart(4, "0"),
      });
    }
    return items;
  }

  for (const propSpec of Object.values(memberTypeSpec.properties)) {
    if (propSpec.deprecated) continue;
    const key = keyFor(propSpec, format);
    // Exclude keys already present (check both formats since existingKeys come from parsed doc)
    if (existingSet.has(propSpec.jsKey) || existingSet.has(propSpec.yamlKey))
      continue;
    items.push({
      label: key,
      kind: "property",
      insertText: format === "yaml" ? `${key}: ` : `${key}: `,
      documentation: propSpec.description,
      detail: propSpec.required ? "(required)" : undefined,
      sortText: String(sortIndex++).padStart(4, "0"),
    });
  }

  return items;
}

/**
 * Check if the existing keys indicate we're inside a nested object property.
 * Returns the children PropertySpec map if so, or undefined if not.
 *
 * Only detects nested context when existing keys match children of a nested
 * property but do NOT match any top-level property of the member type.
 * This avoids false positives when a key like "sql" exists both as a
 * top-level member property and as a child of a nested property.
 */
function resolveNestedChildren(
  existingKeys: string[],
  memberTypeSpec: MemberTypeSpec
): Record<string, PropertySpec> | undefined {
  // Build set of top-level property keys (both formats)
  const topLevelKeys = new Set<string>();
  for (const propSpec of Object.values(memberTypeSpec.properties)) {
    topLevelKeys.add(propSpec.jsKey);
    topLevelKeys.add(propSpec.yamlKey);
  }

  // For each property in the member type that has children,
  // check if any of the existing keys match a child key exclusively
  // (i.e., the key is NOT also a top-level property).
  for (const propSpec of Object.values(memberTypeSpec.properties)) {
    if (!propSpec.children) continue;
    for (const childSpec of Object.values(propSpec.children)) {
      for (const ek of existingKeys) {
        if (
          (ek === childSpec.jsKey || ek === childSpec.yamlKey) &&
          !topLevelKeys.has(ek)
        ) {
          return propSpec.children;
        }
      }
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// property_value completions
// ---------------------------------------------------------------------------

function getPropertyValueCompletions(
  context: Extract<CursorContext, { type: "property_value" }>
): CompletionItem[] {
  // Find the property spec by key (try both formats)
  const propSpec = findPropertySpec(context.propertyKey, context.memberType);
  if (!propSpec) return [];

  if (propSpec.type === "enum" && propSpec.values) {
    return propSpec.values.map((value, i) => ({
      label: value,
      kind: "value" as const,
      insertText: value,
      documentation: propSpec.description,
      sortText: String(i).padStart(4, "0"),
    }));
  }

  return [];
}

/**
 * Find a PropertySpec by key, searching cube-level properties and member-type properties.
 */
function findPropertySpec(
  key: string,
  memberType: string | null
): PropertySpec | undefined {
  // If we have a member type, search that member's properties
  if (memberType) {
    const memberTypeSpec = getMemberTypeSpec(memberType);
    if (memberTypeSpec) {
      // Search by jsKey or yamlKey
      for (const spec of Object.values(memberTypeSpec.properties)) {
        if (spec.jsKey === key || spec.yamlKey === key) return spec;
      }
    }
  }

  // Search cube-level properties
  for (const construct of Object.values(cubeJsSpec.constructs)) {
    for (const spec of Object.values(construct.properties)) {
      if (spec.jsKey === key || spec.yamlKey === key) return spec;
    }
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// sql context completions
// ---------------------------------------------------------------------------

function getSqlCompletions(
  context: Extract<CursorContext, { type: "sql" }>,
  registry: CubeRegistry
): CompletionItem[] {
  const { prefix } = context;
  const items: CompletionItem[] = [];

  // If prefix contains a dot, it might be a cube member reference like "Orders."
  if (prefix.includes(".")) {
    const parts = prefix.split(".");
    const cubeName = parts[0];

    // Check if this is a known cube name
    const cube = registry.getCube(cubeName);
    if (cube) {
      const memberPrefix = parts.slice(1).join(".");
      // Suggest members of that cube
      for (const dim of cube.dimensions) {
        if (!memberPrefix || dim.name.startsWith(memberPrefix)) {
          items.push({
            label: `${cubeName}.${dim.name}`,
            kind: "reference",
            insertText: `${cubeName}.${dim.name}`,
            documentation: `Dimension (${dim.type})`,
            detail: "dimension",
          });
        }
      }
      for (const meas of cube.measures) {
        if (!memberPrefix || meas.name.startsWith(memberPrefix)) {
          items.push({
            label: `${cubeName}.${meas.name}`,
            kind: "reference",
            insertText: `${cubeName}.${meas.name}`,
            documentation: `Measure (${meas.type})`,
            detail: "measure",
          });
        }
      }
      for (const seg of cube.segments) {
        if (!memberPrefix || seg.name.startsWith(memberPrefix)) {
          items.push({
            label: `${cubeName}.${seg.name}`,
            kind: "reference",
            insertText: `${cubeName}.${seg.name}`,
            documentation: "Segment",
            detail: "segment",
          });
        }
      }
      return items;
    }

    // If prefix starts with "CUBE.", return nothing (CUBE doesn't have member access in completions)
    if (cubeName === "CUBE") {
      return [];
    }

    return [];
  }

  // No dot — suggest template variables and cube names from registry
  for (const tv of cubeJsSpec.templateVariables) {
    if (!prefix || tv.name.startsWith(prefix)) {
      items.push({
        label: tv.name,
        kind: "variable",
        insertText: tv.snippet ?? tv.name,
        isSnippet: tv.snippet !== tv.name,
        documentation: tv.description,
        detail: "template variable",
      });
    }
  }

  // Also suggest cube names from registry
  for (const cubeName of registry.getAllCubeNames()) {
    if (!prefix || cubeName.startsWith(prefix)) {
      items.push({
        label: cubeName,
        kind: "reference",
        insertText: cubeName,
        documentation: "Cube reference",
        detail: "cube",
      });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Monaco CompletionItemProvider factory
// ---------------------------------------------------------------------------

/**
 * Create a Monaco CompletionItemProvider that uses the language service.
 * Registers for both 'yaml' and 'javascript' languages.
 *
 * @param registry - CubeRegistry instance for cross-cube references
 * @returns An object with `provider` (the Monaco CompletionItemProvider) and
 *          `triggerCharacters` for registration.
 */
export function createCompletionProvider(registry: CubeRegistry): {
  triggerCharacters: string[];
  provideCompletionItems: (model: any, position: any, ...args: any[]) => any;
} {
  return {
    triggerCharacters: [".", "$", ":"],
    provideCompletionItems(model: any, position: any) {
      const code = model.getValue();
      const languageId = model.getLanguageId();
      const format: Format = languageId === "yaml" ? "yaml" : "js";

      // Parse document
      const doc =
        format === "yaml" ? parseYamlDocument(code) : parseJsDocument(code);

      // Get cursor context
      const cursorContext =
        format === "yaml"
          ? getYamlCursorContext(doc, position, code)
          : getJsCursorContext(doc, position);

      // Get completions
      const completions = getCompletions(cursorContext, format, registry);

      // Map to Monaco completion items
      // Monaco's CompletionItemKind values (numeric enum):
      // Property = 9, Value = 11, Snippet = 27, Reference = 17, Variable = 4
      const kindMap: Record<string, number> = {
        property: 9,
        value: 11,
        snippet: 27,
        reference: 17,
        variable: 4,
      };

      const suggestions = completions.map((item) => ({
        label: item.label,
        kind: kindMap[item.kind] ?? 9,
        insertText: item.insertText,
        insertTextRules: item.isSnippet ? 4 : undefined, // InsertTextRule.InsertAsSnippet = 4
        documentation: item.documentation
          ? { value: item.documentation }
          : undefined,
        detail: item.detail,
        sortText: item.sortText,
      }));

      return { suggestions };
    },
  };
}
