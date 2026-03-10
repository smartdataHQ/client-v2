/**
 * YAML parser for Cube.js model files.
 *
 * Converts YAML source into a ParsedDocument with source-position tracking,
 * and provides getCursorContext() for semantic cursor analysis.
 */
import YAML from "yaml";

import type {
  ParsedDocument,
  ParsedCube,
  ParsedView,
  ParsedMember,
  ParsedProperty,
  MonacoRange,
  CursorContext,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Position {
  lineNumber: number;
  column: number;
}

/**
 * Convert a 0-based byte offset in `code` to a 1-based Monaco position.
 */
export function offsetToPosition(code: string, offset: number): Position {
  let line = 1;
  let col = 1;
  for (let i = 0; i < offset && i < code.length; i++) {
    if (code[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { lineNumber: line, column: col };
}

/**
 * Build a MonacoRange from two byte offsets.
 */
function rangeFromOffsets(
  code: string,
  start: number,
  end: number
): MonacoRange {
  const s = offsetToPosition(code, start);
  const e = offsetToPosition(code, end);
  return {
    startLineNumber: s.lineNumber,
    startColumn: s.column,
    endLineNumber: e.lineNumber,
    endColumn: e.column,
  };
}

/**
 * Get the range of a YAML AST node (uses the `range` property: [start, valueEnd, nodeEnd]).
 */
function nodeRange(code: string, node: YAML.Node): MonacoRange {
  const r = node.range;
  if (!r) return rangeFromOffsets(code, 0, 0);
  return rangeFromOffsets(code, r[0], r[1]);
}

/**
 * Safely get a value from a YAMLMap by key string.
 */
function mapGet(map: YAML.YAMLMap, key: string): YAML.Node | undefined {
  for (const item of map.items) {
    const pair = item as YAML.Pair;
    if (YAML.isScalar(pair.key) && pair.key.value === key) {
      return pair.value as YAML.Node | undefined;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Member group keys recognized by Cube.js
// ---------------------------------------------------------------------------

const MEMBER_GROUP_KEYS = new Set([
  "dimensions",
  "measures",
  "joins",
  "segments",
  "pre_aggregations",
]);

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/**
 * Parse a single member (dimension, measure, join, segment, etc.) from a
 * YAMLMap node inside a member group sequence.
 */
function parseMember(code: string, memberMap: YAML.YAMLMap): ParsedMember {
  const nameNode = mapGet(memberMap, "name");
  const name = YAML.isScalar(nameNode) ? String(nameNode.value) : "";
  const nameRange = nameNode
    ? nodeRange(code, nameNode)
    : nodeRange(code, memberMap);

  const properties: ParsedProperty[] = [];

  for (const item of memberMap.items) {
    const pair = item as YAML.Pair;
    if (!YAML.isScalar(pair.key)) continue;
    const key = String(pair.key.value);
    const valNode = pair.value as YAML.Node | undefined;
    const pairRange = pairNodeRange(code, pair);
    const valueRange = valNode ? nodeRange(code, valNode) : pairRange;
    properties.push({
      key,
      value: valNode
        ? (valNode as YAML.Scalar).value ?? nodeToJS(valNode)
        : null,
      range: pairRange,
      valueRange,
    });
  }

  return {
    name,
    range: nodeRange(code, memberMap),
    nameRange,
    properties,
  };
}

/**
 * Get a range covering an entire Pair (key + value).
 */
function pairNodeRange(code: string, pair: YAML.Pair): MonacoRange {
  const keyNode = pair.key as YAML.Node | undefined;
  const valNode = pair.value as YAML.Node | undefined;
  const start = keyNode?.range?.[0] ?? 0;
  const end = valNode?.range?.[1] ?? keyNode?.range?.[1] ?? start;
  return rangeFromOffsets(code, start, end);
}

/**
 * Safely convert a YAML node to a JS value.
 */
function nodeToJS(node: YAML.Node): unknown {
  try {
    return (node as any).toJSON?.() ?? null;
  } catch {
    return null;
  }
}

/**
 * Parse a cube or view from a YAMLMap node.
 */
function parseCubeOrView(
  code: string,
  cubeMap: YAML.YAMLMap
): {
  name: string;
  nameRange: MonacoRange;
  properties: ParsedProperty[];
  members: Record<string, ParsedMember[]>;
} {
  const nameNode = mapGet(cubeMap, "name");
  const name = YAML.isScalar(nameNode) ? String(nameNode.value) : "";
  const nameRange = nameNode
    ? nodeRange(code, nameNode)
    : nodeRange(code, cubeMap);

  const properties: ParsedProperty[] = [];
  const members: Record<string, ParsedMember[]> = {};

  for (const item of cubeMap.items) {
    const pair = item as YAML.Pair;
    if (!YAML.isScalar(pair.key)) continue;
    const key = String(pair.key.value);

    if (MEMBER_GROUP_KEYS.has(key)) {
      const seq = pair.value;
      if (YAML.isSeq(seq)) {
        members[key] = [];
        for (const memberNode of seq.items) {
          if (YAML.isMap(memberNode)) {
            members[key].push(parseMember(code, memberNode));
          }
        }
      }
    } else {
      const valNode = pair.value as YAML.Node | undefined;
      const pRange = pairNodeRange(code, pair);
      const valueRange = valNode ? nodeRange(code, valNode) : pRange;
      properties.push({
        key,
        value: valNode
          ? YAML.isScalar(valNode)
            ? valNode.value
            : nodeToJS(valNode!)
          : null,
        range: pRange,
        valueRange,
      });
    }
  }

  return { name, nameRange, properties, members };
}

/**
 * Parse a YAML string containing Cube.js model definitions.
 */
export function parseYamlDocument(code: string): ParsedDocument {
  const result: ParsedDocument = {
    format: "yaml",
    cubes: [],
    views: [],
    errors: [],
  };

  if (!code.trim()) return result;

  let doc: YAML.Document.Parsed;
  try {
    doc = YAML.parseDocument(code, { keepSourceTokens: true });
  } catch (e: any) {
    result.errors.push({
      message: e.message ?? "YAML parse error",
      range: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      },
    });
    return result;
  }

  // Collect YAML-level errors/warnings
  for (const err of doc.errors) {
    const pos = err.pos
      ? rangeFromOffsets(code, err.pos[0], err.pos[1])
      : {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1,
        };
    result.errors.push({ message: err.message, range: pos });
  }

  if (result.errors.length > 0 && !doc.contents) return result;

  const root = doc.contents;
  if (!YAML.isMap(root)) return result;

  // Parse cubes
  const cubesNode = mapGet(root, "cubes");
  if (YAML.isSeq(cubesNode)) {
    for (const cubeNode of cubesNode.items) {
      if (YAML.isMap(cubeNode)) {
        const parsed = parseCubeOrView(code, cubeNode);
        result.cubes.push(parsed as ParsedCube);
      }
    }
  }

  // Parse views
  const viewsNode = mapGet(root, "views");
  if (YAML.isSeq(viewsNode)) {
    for (const viewNode of viewsNode.items) {
      if (YAML.isMap(viewNode)) {
        const parsed = parseCubeOrView(code, viewNode);
        result.views.push(parsed as ParsedView);
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Cursor Context
// ---------------------------------------------------------------------------

/**
 * Check if a Monaco position is inside a MonacoRange.
 */
function positionInRange(pos: Position, range: MonacoRange): boolean {
  if (
    pos.lineNumber < range.startLineNumber ||
    pos.lineNumber > range.endLineNumber
  )
    return false;
  if (
    pos.lineNumber === range.startLineNumber &&
    pos.column < range.startColumn
  )
    return false;
  if (pos.lineNumber === range.endLineNumber && pos.column > range.endColumn)
    return false;
  return true;
}

/**
 * Convert a 1-based Monaco position to a 0-based offset.
 */
function positionToOffset(code: string, pos: Position): number {
  const lines = code.split("\n");
  let offset = 0;
  for (let i = 0; i < pos.lineNumber - 1 && i < lines.length; i++) {
    offset += lines[i].length + 1; // +1 for newline
  }
  offset += pos.column - 1;
  return offset;
}

/**
 * Determine the semantic context at a given cursor position.
 */
export function getCursorContext(
  doc: ParsedDocument,
  position: Position,
  code?: string
): CursorContext {
  // Search cubes and views
  const allConstructs: Array<{
    construct: ParsedCube | ParsedView;
    constructType: "cube" | "view";
  }> = [
    ...doc.cubes.map((c) => ({ construct: c, constructType: "cube" as const })),
    ...doc.views.map((v) => ({ construct: v, constructType: "view" as const })),
  ];

  for (const { construct, constructType } of allConstructs) {
    // Check if cursor is on a top-level property value
    for (const prop of construct.properties) {
      if (positionInRange(position, prop.valueRange)) {
        // Check if this is a sql property
        if (prop.key === "sql" || prop.key === "sql_table") {
          if (prop.key === "sql") {
            const prefix = extractSqlPrefix(code, position);
            return {
              type: "sql",
              cubeName: construct.name,
              memberType: null,
              memberName: null,
              isTemplateLiteral: prefix.isTemplateLiteral,
              prefix: prefix.prefix,
            };
          }
        }
        return {
          type: "property_value",
          cubeName: construct.name,
          memberType: null,
          memberName: null,
          propertyKey: prop.key,
        };
      }
    }

    // Check member groups
    for (const [memberType, memberList] of Object.entries(construct.members)) {
      // Check each member
      for (const member of memberList) {
        // Check member properties
        for (const prop of member.properties) {
          if (positionInRange(position, prop.valueRange)) {
            if (prop.key === "sql") {
              const prefix = extractSqlPrefix(code, position);
              return {
                type: "sql",
                cubeName: construct.name,
                memberType,
                memberName: member.name,
                isTemplateLiteral: prefix.isTemplateLiteral,
                prefix: prefix.prefix,
              };
            }
            return {
              type: "property_value",
              cubeName: construct.name,
              memberType,
              memberName: member.name,
              propertyKey: prop.key,
            };
          }
        }

        // Check if cursor is inside the member's range but not on any property value
        if (positionInRange(position, member.range)) {
          return {
            type: "member_body",
            cubeName: construct.name,
            memberType,
            memberName: member.name,
            existingKeys: member.properties.map((p) => p.key),
          };
        }
      }

      // Check if cursor is in the member list area (between members or at the end)
      // We check this by seeing if the cursor is on a line within the member group
      // but not inside any specific member
      if (memberList.length > 0) {
        const firstMember = memberList[0];
        const lastMember = memberList[memberList.length - 1];
        // Extend range from first member start to last member end, plus a couple lines for the group key
        const groupRange: MonacoRange = {
          startLineNumber: Math.max(1, firstMember.range.startLineNumber - 1),
          startColumn: 1,
          endLineNumber: lastMember.range.endLineNumber + 1,
          endColumn: 1,
        };
        if (positionInRange(position, groupRange)) {
          return {
            type: "member_list",
            cubeName: construct.name,
            memberType,
          };
        }
      }
    }

    // If cursor is near the cube's name range area, it's cube_root
    // Use a heuristic: if on a line within a reasonable range of the cube's properties
    const cubeLines = getCubeLineRange(construct);
    if (
      position.lineNumber >= cubeLines.start &&
      position.lineNumber <= cubeLines.end
    ) {
      return {
        type: "cube_root",
        cubeName: construct.name,
        constructType,
      };
    }
  }

  return { type: "unknown" };
}

/**
 * Get the line range that a cube/view spans.
 */
function getCubeLineRange(construct: ParsedCube | ParsedView): {
  start: number;
  end: number;
} {
  let start = construct.nameRange.startLineNumber;
  let end = construct.nameRange.endLineNumber;

  for (const prop of construct.properties) {
    if (prop.range.startLineNumber < start) start = prop.range.startLineNumber;
    if (prop.range.endLineNumber > end) end = prop.range.endLineNumber;
  }

  for (const members of Object.values(construct.members)) {
    for (const member of members) {
      if (member.range.startLineNumber < start)
        start = member.range.startLineNumber;
      if (member.range.endLineNumber > end) end = member.range.endLineNumber;
    }
  }

  return { start, end };
}

/**
 * Extract the prefix text before the cursor within a SQL value,
 * and detect if we are inside a template literal `${}`.
 */
function extractSqlPrefix(
  code: string | undefined,
  position: Position
): { isTemplateLiteral: boolean; prefix: string } {
  if (!code) return { isTemplateLiteral: false, prefix: "" };

  const offset = positionToOffset(code, position);
  // Look backwards from cursor for `${`
  let i = offset - 1;
  let prefix = "";
  let isTemplateLiteral = false;

  while (i >= 0) {
    if (code[i] === "{" && i > 0 && code[i - 1] === "$") {
      isTemplateLiteral = true;
      prefix = code.substring(i + 1, offset);
      break;
    }
    if (code[i] === "}" || code[i] === "\n") {
      break;
    }
    i--;
  }

  return { isTemplateLiteral, prefix };
}
