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
      return getPropertyValueCompletions(context, registry);
    case "sql":
      return getSqlCompletions(context, registry);
    case "unknown": {
      if (format === "yaml") {
        return [
          {
            label: "cubes",
            kind: "snippet",
            insertText:
              'cubes:\n  - name: $1\n    sql_table: $2\n\n    dimensions:\n      - name: $3\n        sql: "${CUBE}.$4"\n        type: $5\n',
            isSnippet: true,
            documentation: "Create a new cube definition",
            detail: "cube template",
          },
          {
            label: "views",
            kind: "snippet",
            insertText:
              'views:\n  - name: $1\n    cubes:\n      - join_path: $2\n        includes: "*"\n',
            isSnippet: true,
            documentation: "Create a new view definition",
            detail: "view template",
          },
        ];
      }
      return [
        {
          label: "cube",
          kind: "snippet",
          insertText:
            "cube(`$1`, {\n  sql_table: `$2`,\n\n  dimensions: {\n    $3: {\n      sql: `${CUBE}.$4`,\n      type: `$5`,\n    },\n  },\n});\n",
          isSnippet: true,
          documentation: "Create a new cube definition",
          detail: "cube template",
        },
        {
          label: "view",
          kind: "snippet",
          insertText:
            "view(`$1`, {\n  cubes: {\n    $2: {\n      includes: `*`,\n    },\n  },\n});\n",
          isSnippet: true,
          documentation: "Create a new view definition",
          detail: "view template",
        },
      ];
    }
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
    items.push(...getYamlMemberSkeletons(normalized));
  } else {
    items.push(...getJsMemberSkeletons(normalized));
  }

  return items;
}

function getYamlMemberSkeletons(memberType: string): CompletionItem[] {
  switch (memberType) {
    case "dimensions":
      return [
        {
          label: "new string dimension",
          kind: "snippet",
          insertText: '- name: $1\n  sql: "${CUBE}.$2"\n  type: string',
          isSnippet: true,
          documentation: "Add a string dimension",
          detail: "dimension",
        },
        {
          label: "new time dimension",
          kind: "snippet",
          insertText: '- name: $1\n  sql: "${CUBE}.$2"\n  type: time',
          isSnippet: true,
          documentation: "Add a time dimension",
          detail: "dimension",
        },
        {
          label: "new number dimension",
          kind: "snippet",
          insertText: '- name: $1\n  sql: "${CUBE}.$2"\n  type: number',
          isSnippet: true,
          documentation: "Add a number dimension",
          detail: "dimension",
        },
      ];
    case "measures":
      return [
        {
          label: "new count measure",
          kind: "snippet",
          insertText: "- name: $1\n  type: count",
          isSnippet: true,
          documentation: "Add a count measure",
          detail: "measure",
        },
        {
          label: "new sum measure",
          kind: "snippet",
          insertText: '- name: $1\n  type: sum\n  sql: "${CUBE}.$2"',
          isSnippet: true,
          documentation: "Add a sum measure",
          detail: "measure",
        },
        {
          label: "new avg measure",
          kind: "snippet",
          insertText: '- name: $1\n  type: avg\n  sql: "${CUBE}.$2"',
          isSnippet: true,
          documentation: "Add an avg measure",
          detail: "measure",
        },
      ];
    case "joins":
      return [
        {
          label: "new join",
          kind: "snippet",
          insertText:
            "- name: $1\n  sql: ${CUBE}.$2 = ${$3.$4}\n  relationship: $5",
          isSnippet: true,
          documentation: "Add a new join",
          detail: "join skeleton",
        },
      ];
    case "segments":
      return [
        {
          label: "new segment",
          kind: "snippet",
          insertText: "- name: $1\n  sql: $2",
          isSnippet: true,
          documentation: "Add a new segment",
          detail: "segment skeleton",
        },
      ];
    case "preAggregations":
      return [
        {
          label: "new pre-aggregation",
          kind: "snippet",
          insertText:
            "- name: $1\n  type: rollup\n  measures: $2\n  dimensions: $3",
          isSnippet: true,
          documentation: "Add a new pre-aggregation",
          detail: "pre-aggregation skeleton",
        },
      ];
    default:
      return [
        {
          label: "new member",
          kind: "snippet",
          insertText: "- name: $1",
          isSnippet: true,
          documentation: "Add a new member",
        },
      ];
  }
}

function getJsMemberSkeletons(memberType: string): CompletionItem[] {
  switch (memberType) {
    case "dimensions":
      return [
        {
          label: "new string dimension",
          kind: "snippet",
          insertText: "$1: {\n  sql: `${CUBE}.$2`,\n  type: `string`,\n}",
          isSnippet: true,
          documentation: "Add a string dimension",
          detail: "dimension",
        },
        {
          label: "new time dimension",
          kind: "snippet",
          insertText: "$1: {\n  sql: `${CUBE}.$2`,\n  type: `time`,\n}",
          isSnippet: true,
          documentation: "Add a time dimension",
          detail: "dimension",
        },
        {
          label: "new number dimension",
          kind: "snippet",
          insertText: "$1: {\n  sql: `${CUBE}.$2`,\n  type: `number`,\n}",
          isSnippet: true,
          documentation: "Add a number dimension",
          detail: "dimension",
        },
      ];
    case "measures":
      return [
        {
          label: "new count measure",
          kind: "snippet",
          insertText: "$1: {\n  type: `count`,\n}",
          isSnippet: true,
          documentation: "Add a count measure",
          detail: "measure",
        },
        {
          label: "new sum measure",
          kind: "snippet",
          insertText: "$1: {\n  type: `sum`,\n  sql: `${CUBE}.$2`,\n}",
          isSnippet: true,
          documentation: "Add a sum measure",
          detail: "measure",
        },
        {
          label: "new avg measure",
          kind: "snippet",
          insertText: "$1: {\n  type: `avg`,\n  sql: `${CUBE}.$2`,\n}",
          isSnippet: true,
          documentation: "Add an avg measure",
          detail: "measure",
        },
      ];
    case "joins":
      return [
        {
          label: "new join",
          kind: "snippet",
          insertText:
            "$1: {\n  sql: `${CUBE}.$2 = ${$3.$4}`,\n  relationship: `$5`,\n}",
          isSnippet: true,
          documentation: "Add a new join",
          detail: "join skeleton",
        },
      ];
    case "segments":
      return [
        {
          label: "new segment",
          kind: "snippet",
          insertText: "$1: {\n  sql: `$2`,\n}",
          isSnippet: true,
          documentation: "Add a new segment",
          detail: "segment skeleton",
        },
      ];
    case "preAggregations":
      return [
        {
          label: "new pre-aggregation",
          kind: "snippet",
          insertText:
            "$1: {\n  type: `rollup`,\n  measures: $2,\n  dimensions: $3,\n}",
          isSnippet: true,
          documentation: "Add a new pre-aggregation",
          detail: "pre-aggregation skeleton",
        },
      ];
    default:
      return [
        {
          label: "new member",
          kind: "snippet",
          insertText: "$1: {\n}",
          isSnippet: true,
          documentation: "Add a new member",
        },
      ];
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
  context: Extract<CursorContext, { type: "property_value" }>,
  registry: CubeRegistry
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

  // Reference values — suggest cube members from registry
  if (propSpec.type === "reference" && propSpec.referenceType) {
    const items: CompletionItem[] = [];
    for (const cube of registry.getAllEntries()) {
      const members =
        propSpec.referenceType === "dimension"
          ? cube.dimensions
          : propSpec.referenceType === "measure"
          ? cube.measures
          : propSpec.referenceType === "segment"
          ? cube.segments
          : [];
      for (const m of members) {
        items.push({
          label: `${cube.name}.${m.name}`,
          kind: "reference",
          insertText: `${cube.name}.${m.name}`,
          documentation: `${propSpec.referenceType} (${m.type})`,
          detail: cube.name,
        });
      }
    }
    return items;
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

    if (cubeName === "CUBE") {
      // Suggest table columns for the current cube's source table.
      const cubeNameLower = context.cubeName?.toLowerCase() || "";
      for (const tableKey of registry.getAllTableKeys()) {
        const tableName = tableKey.split(".").pop()?.toLowerCase() || "";
        if (
          tableName === cubeNameLower ||
          tableName.includes(cubeNameLower) ||
          cubeNameLower.includes(tableName)
        ) {
          const columns = registry.getTableColumns(tableKey);
          for (const col of columns) {
            items.push({
              label: col.name,
              kind: "reference",
              insertText: col.name,
              documentation: `Column (${col.type}) from ${tableKey}`,
              detail: col.type,
            });
          }
          break;
        }
      }
      return items;
    }

    return [];
  }

  // No dot — suggest template variables and cube names from registry
  // When NOT inside a template literal (${...}), wrap with ${}
  const wrapTemplate = !context.isTemplateLiteral;
  for (const tv of cubeJsSpec.templateVariables) {
    if (!prefix || tv.name.startsWith(prefix)) {
      const rawText = tv.snippet ?? tv.name;
      items.push({
        label: wrapTemplate ? `\${${tv.name}}` : tv.name,
        kind: "variable",
        insertText: wrapTemplate ? `\${${rawText}}` : rawText,
        isSnippet: tv.snippet !== tv.name,
        documentation: tv.description,
        detail: "template variable",
      });
    }
  }

  // Also suggest cube names from registry (wrapped in ${} when outside template literal)
  for (const cubeName of registry.getAllCubeNames()) {
    if (!prefix || cubeName.startsWith(prefix)) {
      items.push({
        label: wrapTemplate ? `\${${cubeName}}` : cubeName,
        kind: "reference",
        insertText: wrapTemplate ? `\${${cubeName}}` : cubeName,
        documentation: "Cube reference",
        detail: "cube",
      });
    }
  }

  // Suggest column names from the current cube's source table (lower priority)
  const cubeNameLower = context.cubeName?.toLowerCase() || "";
  for (const tableKey of registry.getAllTableKeys()) {
    const tableName = tableKey.split(".").pop()?.toLowerCase() || "";
    if (
      tableName === cubeNameLower ||
      tableName.includes(cubeNameLower) ||
      cubeNameLower.includes(tableName)
    ) {
      for (const col of registry.getTableColumns(tableKey)) {
        if (
          !prefix ||
          col.name.toLowerCase().startsWith(prefix.toLowerCase())
        ) {
          items.push({
            label: col.name,
            kind: "reference",
            insertText: col.name,
            documentation: `Column (${col.type}) from ${tableKey}`,
            detail: "column",
            sortText: "zz" + col.name,
          });
        }
      }
      break;
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
    triggerCharacters: [".", "$", ":", " ", "{"],
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
