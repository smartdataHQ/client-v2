/**
 * Hover provider for Cube.js model files.
 *
 * Exports:
 * - `getHoverInfo()` — testable pure function: (word, context, format, spec, registry) → HoverInfo | null
 * - `createHoverProvider()` — Monaco HoverProvider wrapper
 */

import {
  parseYamlDocument,
  getCursorContext as getYamlCursorContext,
} from "./yamlParser";
import {
  parseJsDocument,
  getCursorContext as getJsCursorContext,
} from "./jsParser";

import type { CubeRegistry } from "./registry";
import type {
  CursorContext,
  PropertySpec,
  MemberTypeSpec,
  SchemaSpec,
  MonacoRange,
  TemplateVariableSpec,
} from "./types";

// ---------------------------------------------------------------------------
// HoverInfo (testable, Monaco-independent)
// ---------------------------------------------------------------------------

export interface HoverInfo {
  content: string; // Markdown content
  range?: MonacoRange;
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
function getMemberTypeSpec(
  spec: SchemaSpec,
  memberType: string
): MemberTypeSpec | undefined {
  const normalized = normalizeMemberType(memberType);
  return spec.constructs.cube.memberTypes[normalized];
}

/**
 * Find a PropertySpec by key in a properties record, matching either jsKey or yamlKey.
 */
function findPropertyByKey(
  properties: Record<string, PropertySpec>,
  word: string
): PropertySpec | undefined {
  // Direct key match first
  if (properties[word]) return properties[word];
  // Search by yamlKey or jsKey
  for (const prop of Object.values(properties)) {
    if (prop.yamlKey === word || prop.jsKey === word) return prop;
  }
  return undefined;
}

/**
 * Format a property spec as markdown hover content.
 */
function formatPropertyHover(prop: PropertySpec): string {
  const parts: string[] = [];

  parts.push(`**${prop.key}** (${prop.type})`);
  parts.push("");
  parts.push(prop.description);

  if (prop.values && prop.values.length > 0) {
    parts.push("");
    parts.push(
      `Valid values: ${prop.values.map((v) => `\`${v}\``).join(", ")}`
    );
  }

  if (prop.deprecated) {
    parts.push("");
    if (prop.deprecatedBy) {
      parts.push(`**Deprecated:** Use \`${prop.deprecatedBy}\` instead.`);
    } else {
      parts.push("**Deprecated.**");
    }
  }

  return parts.join("\n");
}

/**
 * Format a template variable spec as markdown hover content.
 */
function formatTemplateVariableHover(tv: TemplateVariableSpec): string {
  const parts: string[] = [];

  parts.push(`**${tv.name}**`);
  parts.push("");
  parts.push(tv.description);

  if (tv.snippet) {
    parts.push("");
    parts.push(`Usage: \`\${${tv.snippet}}\``);
  }

  if (tv.methods && tv.methods.length > 0) {
    parts.push("");
    parts.push(`Methods: ${tv.methods.map((m) => `\`${m}\``).join(", ")}`);
  }

  return parts.join("\n");
}

/**
 * Format a cube registry entry as markdown hover content.
 */
function formatCubeHover(
  cubeName: string,
  cubeType: "cube" | "view",
  dimensions: string[],
  measures: string[]
): string {
  const parts: string[] = [];

  parts.push(`**${cubeName}** (${cubeType})`);

  if (dimensions.length > 0) {
    parts.push("");
    parts.push(`Dimensions: ${dimensions.join(", ")}`);
  }

  if (measures.length > 0) {
    parts.push("");
    parts.push(`Measures: ${measures.join(", ")}`);
  }

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// getHoverInfo
// ---------------------------------------------------------------------------

/**
 * Pure function that returns hover info for a given word and cursor context.
 * No Monaco dependency — designed to be testable in isolation.
 */
export function getHoverInfo(
  word: string,
  context: CursorContext,
  format: Format,
  spec: SchemaSpec,
  registry: CubeRegistry
): HoverInfo | null {
  if (!word || word.trim() === "") return null;

  // 1. Check template variables (applies in sql context or if word matches a known template var)
  const templateVar = spec.templateVariables.find((tv) => tv.name === word);
  if (templateVar) {
    return { content: formatTemplateVariableHover(templateVar) };
  }

  // 2. Check cube registry references
  const cubeEntry = registry.getCube(word);
  if (cubeEntry) {
    const dimNames = cubeEntry.dimensions.map((d) => d.name);
    const measureNames = cubeEntry.measures.map((m) => m.name);
    return {
      content: formatCubeHover(
        cubeEntry.name,
        cubeEntry.type,
        dimNames,
        measureNames
      ),
    };
  }

  // 3. Look up property in spec based on context
  switch (context.type) {
    case "member_body": {
      const memberSpec = getMemberTypeSpec(spec, context.memberType);
      if (memberSpec) {
        const prop = findPropertyByKey(memberSpec.properties, word);
        if (prop) return { content: formatPropertyHover(prop) };
      }
      break;
    }

    case "cube_root": {
      const constructSpec = spec.constructs[context.constructType];
      if (constructSpec) {
        const prop = findPropertyByKey(constructSpec.properties, word);
        if (prop) return { content: formatPropertyHover(prop) };
      }
      break;
    }

    case "property_value": {
      // Look up the property being assigned to show its info
      if (context.memberType) {
        const memberSpec = getMemberTypeSpec(spec, context.memberType);
        if (memberSpec) {
          const prop = findPropertyByKey(
            memberSpec.properties,
            context.propertyKey
          );
          if (prop) return { content: formatPropertyHover(prop) };
        }
      } else {
        // Cube-root property value
        for (const construct of Object.values(spec.constructs)) {
          const prop = findPropertyByKey(
            construct.properties,
            context.propertyKey
          );
          if (prop) return { content: formatPropertyHover(prop) };
        }
      }
      break;
    }

    case "sql": {
      // In SQL context, template variables already checked above
      break;
    }

    case "member_list": {
      // Not much to hover on in member list context
      break;
    }

    case "unknown": {
      // Try all constructs and member types as fallback
      for (const construct of Object.values(spec.constructs)) {
        const prop = findPropertyByKey(construct.properties, word);
        if (prop) return { content: formatPropertyHover(prop) };

        for (const memberType of Object.values(construct.memberTypes)) {
          const memberProp = findPropertyByKey(memberType.properties, word);
          if (memberProp) return { content: formatPropertyHover(memberProp) };
        }
      }
      break;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// createHoverProvider — Monaco wrapper
// ---------------------------------------------------------------------------

/**
 * Creates a Monaco HoverProvider that delegates to getHoverInfo().
 * Register the returned provider for both 'yaml' and 'javascript'.
 */
export function createHoverProvider(
  spec: SchemaSpec,
  registry: CubeRegistry
): { provideHover: (model: any, position: any) => any } {
  return {
    provideHover(model: any, position: any) {
      const code = model.getValue();
      const path: string = model.uri?.path || "";

      const isYaml = path.endsWith(".yml") || path.endsWith(".yaml");
      const format: Format = isYaml ? "yaml" : "js";

      // Parse the document
      const doc = isYaml ? parseYamlDocument(code) : parseJsDocument(code);

      // Get cursor context
      const cursorContext = isYaml
        ? getYamlCursorContext(doc, position, code)
        : getJsCursorContext(doc, position, code);

      // Get word at position
      const wordInfo = model.getWordAtPosition(position);
      if (!wordInfo) return null;

      const word = wordInfo.word;

      const hoverInfo = getHoverInfo(
        word,
        cursorContext,
        format,
        spec,
        registry
      );
      if (!hoverInfo) return null;

      const range = {
        startLineNumber: position.lineNumber,
        startColumn: wordInfo.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: wordInfo.endColumn,
      };

      return {
        range,
        contents: [{ value: hoverInfo.content }],
      };
    },
  };
}
