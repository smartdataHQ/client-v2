/**
 * JS parser for Cube.js model files.
 *
 * Extracts cube() and view() call definitions from JavaScript source,
 * producing a ParsedDocument with source-position tracking and a
 * getCursorContext() helper for editor completions.
 *
 * Strategy: regex to locate call sites, brace-matching to extract config
 * objects, then lightweight property parsing. No external parser libraries.
 */

import type {
  CursorContext,
  MonacoRange,
  ParsedCube,
  ParsedDocument,
  ParsedMember,
  ParsedProperty,
  ParsedView,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Position {
  lineNumber: number;
  column: number;
}

/** Convert a 0-based offset in `code` to a 1-based line/column position. */
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

function makeRange(
  code: string,
  startOffset: number,
  endOffset: number
): MonacoRange {
  const start = offsetToPosition(code, startOffset);
  const end = offsetToPosition(code, endOffset);
  return {
    startLineNumber: start.lineNumber,
    startColumn: start.column,
    endLineNumber: end.lineNumber,
    endColumn: end.column,
  };
}

/**
 * Starting from `offset` (which should point at an opening brace/bracket),
 * find the matching closing character. Respects nesting, strings (single,
 * double, backtick), and line/block comments.
 *
 * Returns the offset of the closing character, or -1.
 */
function findMatchingBrace(code: string, offset: number): number {
  const open = code[offset];
  const close =
    open === "{" ? "}" : open === "[" ? "]" : open === "(" ? ")" : "";
  if (!close) return -1;

  let depth = 1;
  let i = offset + 1;
  while (i < code.length && depth > 0) {
    const ch = code[i];

    // Skip line comments
    if (ch === "/" && code[i + 1] === "/") {
      i = code.indexOf("\n", i);
      if (i === -1) return -1;
      i++;
      continue;
    }

    // Skip block comments
    if (ch === "/" && code[i + 1] === "*") {
      i = code.indexOf("*/", i + 2);
      if (i === -1) return -1;
      i += 2;
      continue;
    }

    // Skip string literals
    if (ch === '"' || ch === "'" || ch === "`") {
      i = skipString(code, i);
      if (i === -1) return -1;
      continue;
    }

    if (ch === open) depth++;
    else if (ch === close) depth--;

    i++;
  }
  return depth === 0 ? i - 1 : -1;
}

/** Skip past a string literal starting at `offset`. Returns offset after closing quote, or -1. */
function skipString(code: string, offset: number): number {
  const quote = code[offset];
  let i = offset + 1;
  while (i < code.length) {
    if (code[i] === "\\" && quote !== "`") {
      i += 2;
      continue;
    }
    if (code[i] === "\\" && quote === "`") {
      i += 2;
      continue;
    }
    if (code[i] === quote) {
      return i + 1;
    }
    i++;
  }
  return -1;
}

/** Skip whitespace and comments starting at offset. */
function skipWS(code: string, offset: number): number {
  let i = offset;
  while (i < code.length) {
    if (/\s/.test(code[i])) {
      i++;
      continue;
    }
    if (code[i] === "/" && code[i + 1] === "/") {
      const nl = code.indexOf("\n", i);
      i = nl === -1 ? code.length : nl + 1;
      continue;
    }
    if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end === -1 ? code.length : end + 2;
      continue;
    }
    break;
  }
  return i;
}

// ---------------------------------------------------------------------------
// Extraction helpers
// ---------------------------------------------------------------------------

/** Extract a string or template literal value starting at offset. Returns [value, endOffset] or null. */
function extractStringArg(
  code: string,
  offset: number
): [string, number, number] | null {
  const i = skipWS(code, offset);
  const ch = code[i];
  if (ch !== '"' && ch !== "'" && ch !== "`") return null;
  let j = i + 1;
  let value = "";
  while (j < code.length) {
    if (code[j] === "\\") {
      value += code[j + 1] ?? "";
      j += 2;
      continue;
    }
    if (code[j] === ch) {
      return [value, i, j + 1];
    }
    value += code[j];
    j++;
  }
  return null;
}

const MEMBER_GROUPS = new Set([
  "dimensions",
  "measures",
  "joins",
  "segments",
  "preAggregations",
  "pre_aggregations",
]);

/**
 * Parse the top-level properties and member groups from a config object body.
 * `bodyStart` points to the char after the opening `{`, `bodyEnd` to the char
 * before the closing `}`.
 */
function parseConfigBody(
  code: string,
  bodyStart: number,
  bodyEnd: number
): { properties: ParsedProperty[]; members: Record<string, ParsedMember[]> } {
  const properties: ParsedProperty[] = [];
  const members: Record<string, ParsedMember[]> = {};

  // We'll iterate through top-level key-value pairs in the object
  let i = skipWS(code, bodyStart);

  while (i < bodyEnd) {
    i = skipWS(code, i);
    if (i >= bodyEnd) break;

    // Extract key
    const keyResult = extractKey(code, i);
    if (!keyResult) break;
    const [key, keyStart, keyEnd] = keyResult;

    // Skip to colon
    let ci = skipWS(code, keyEnd);
    if (code[ci] !== ":") break;
    ci++; // skip colon

    // Skip whitespace after colon
    const valueStart = skipWS(code, ci);

    // Determine value extent
    const valueEnd = findValueEnd(code, valueStart, bodyEnd);
    if (valueEnd === -1) break;

    const rawValue = code.slice(valueStart, valueEnd).trim();

    if (MEMBER_GROUPS.has(key) && code[valueStart] === "{") {
      // Parse as member group
      const closeBrace = findMatchingBrace(code, valueStart);
      if (closeBrace !== -1) {
        members[key] = parseMemberGroup(code, valueStart + 1, closeBrace);
        i = closeBrace + 1;
      } else {
        i = valueEnd;
      }
    } else {
      const value = parseValue(rawValue);
      properties.push({
        key,
        value,
        range: makeRange(code, keyStart, valueEnd),
        valueRange: makeRange(code, valueStart, valueEnd),
      });
      i = valueEnd;
    }

    // Skip trailing comma
    i = skipWS(code, i);
    if (i < bodyEnd && code[i] === ",") i++;
  }

  return { properties, members };
}

/** Extract an identifier or string key at offset. Returns [key, startOffset, endOffset] or null. */
function extractKey(
  code: string,
  offset: number
): [string, number, number] | null {
  const i = skipWS(code, offset);
  // String key
  if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
    const result = extractStringArg(code, i);
    if (result) return [result[0], result[1], result[2]];
    return null;
  }
  // Identifier key
  const match = code.slice(i).match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
  if (match) {
    return [match[0], i, i + match[0].length];
  }
  return null;
}

/** Find the end of a value starting at offset, within a parent object ending at parentEnd. */
function findValueEnd(code: string, offset: number, parentEnd: number): number {
  const i = offset;
  if (i >= parentEnd) return parentEnd;

  const ch = code[i];

  // Object or array — find matching brace
  if (ch === "{" || ch === "[") {
    const end = findMatchingBrace(code, i);
    return end === -1 ? -1 : end + 1;
  }

  // Parenthesized expression (arrow functions, etc.)
  if (ch === "(") {
    const end = findMatchingBrace(code, i);
    if (end === -1) return -1;
    // Check if followed by => { ... }
    let after = skipWS(code, end + 1);
    if (code[after] === "=" && code[after + 1] === ">") {
      after = skipWS(code, after + 2);
      if (code[after] === "{") {
        const bodyEnd = findMatchingBrace(code, after);
        return bodyEnd === -1 ? -1 : bodyEnd + 1;
      }
      // Single expression arrow — scan to comma or closing brace
      return scanToDelimiter(code, after, parentEnd);
    }
    return end + 1;
  }

  // Arrow function without parens: identifier => ...
  if (/[a-zA-Z_$]/.test(ch)) {
    // Check if this is `() => ...` pattern
    const restSlice = code.slice(i, Math.min(i + 200, parentEnd));
    const arrowMatch = restSlice.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=>/);
    if (arrowMatch) {
      const afterArrow = skipWS(code, i + arrowMatch[0].length);
      if (code[afterArrow] === "{") {
        const bodyEnd = findMatchingBrace(code, afterArrow);
        return bodyEnd === -1 ? -1 : bodyEnd + 1;
      }
      return scanToDelimiter(code, afterArrow, parentEnd);
    }
  }

  // String literal
  if (ch === '"' || ch === "'" || ch === "`") {
    const end = skipString(code, i);
    return end === -1 ? -1 : end;
  }

  // Other value (number, boolean, identifier, etc.) — scan to comma or end
  return scanToDelimiter(code, i, parentEnd);
}

/** Scan forward to find the next comma or parent-level closing delimiter. */
function scanToDelimiter(
  code: string,
  offset: number,
  parentEnd: number
): number {
  let i = offset;
  while (i < parentEnd) {
    const ch = code[i];
    if (ch === ",") return i;
    if (ch === "}" || ch === "]") return i;
    // Skip nested structures
    if (ch === "{" || ch === "[" || ch === "(") {
      const end = findMatchingBrace(code, i);
      if (end === -1) return -1;
      i = end + 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const end = skipString(code, i);
      if (end === -1) return -1;
      i = end;
      continue;
    }
    if (ch === "/" && code[i + 1] === "/") {
      const nl = code.indexOf("\n", i);
      i = nl === -1 ? parentEnd : nl + 1;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end === -1 ? parentEnd : end + 2;
      continue;
    }
    i++;
  }
  return i;
}

/** Parse a raw value string into a JS-friendly value. */
function parseValue(raw: string): unknown {
  const trimmed = raw.replace(/,\s*$/, "").trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  // String literal
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("`") && trimmed.endsWith("`"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/** Parse members within a member group object body (between { and }). */
function parseMemberGroup(
  code: string,
  bodyStart: number,
  bodyEnd: number
): ParsedMember[] {
  const members: ParsedMember[] = [];
  let i = skipWS(code, bodyStart);

  while (i < bodyEnd) {
    i = skipWS(code, i);
    if (i >= bodyEnd) break;

    // Extract member name (key)
    const keyResult = extractKey(code, i);
    if (!keyResult) break;
    const [name, nameStart, nameEnd] = keyResult;

    // Skip to colon
    let ci = skipWS(code, nameEnd);
    if (code[ci] !== ":") break;
    ci++;

    // Skip to opening brace of member body
    const braceStart = skipWS(code, ci);
    if (code[braceStart] !== "{") {
      // Not an object member, skip this value
      const valEnd = findValueEnd(code, braceStart, bodyEnd);
      if (valEnd === -1) break;
      i = valEnd;
      i = skipWS(code, i);
      if (i < bodyEnd && code[i] === ",") i++;
      continue;
    }

    const braceEnd = findMatchingBrace(code, braceStart);
    if (braceEnd === -1) break;

    // Parse member properties
    const memberProps = parseMemberProperties(code, braceStart + 1, braceEnd);

    members.push({
      name,
      range: makeRange(code, nameStart, braceEnd + 1),
      nameRange: makeRange(code, nameStart, nameEnd),
      properties: memberProps,
    });

    i = braceEnd + 1;
    i = skipWS(code, i);
    if (i < bodyEnd && code[i] === ",") i++;
  }

  return members;
}

/** Parse properties within a member body. */
function parseMemberProperties(
  code: string,
  bodyStart: number,
  bodyEnd: number
): ParsedProperty[] {
  const properties: ParsedProperty[] = [];
  let i = skipWS(code, bodyStart);

  while (i < bodyEnd) {
    i = skipWS(code, i);
    if (i >= bodyEnd) break;

    const keyResult = extractKey(code, i);
    if (!keyResult) break;
    const [key, keyStart, keyEnd] = keyResult;

    let ci = skipWS(code, keyEnd);
    if (code[ci] !== ":") break;
    ci++;

    const valueStart = skipWS(code, ci);
    const valueEnd = findValueEnd(code, valueStart, bodyEnd);
    if (valueEnd === -1) break;

    const rawValue = code.slice(valueStart, valueEnd).trim();
    const value = parseValue(rawValue);

    properties.push({
      key,
      value,
      range: makeRange(code, keyStart, valueEnd),
      valueRange: makeRange(code, valueStart, valueEnd),
    });

    i = valueEnd;
    i = skipWS(code, i);
    if (i < bodyEnd && code[i] === ",") i++;
  }

  return properties;
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseJsDocument(code: string): ParsedDocument {
  const doc: ParsedDocument = {
    format: "js",
    cubes: [],
    views: [],
    errors: [],
  };

  const callRegex = /\b(cube|view)\s*\(/g;
  let match: RegExpExecArray | null;

  while ((match = callRegex.exec(code)) !== null) {
    const constructType = match[1] as "cube" | "view";
    const afterParen = match.index + match[0].length;

    // Extract name (first argument)
    const nameResult = extractStringArg(code, afterParen);
    if (!nameResult) continue;
    const [name, nameStrStart, nameStrEnd] = nameResult;

    // Skip to comma
    let ci = skipWS(code, nameStrEnd);
    if (code[ci] !== ",") continue;
    ci++;

    // Find config object opening brace
    const braceStart = skipWS(code, ci);
    if (code[braceStart] !== "{") continue;

    // Find matching closing brace
    const braceEnd = findMatchingBrace(code, braceStart);
    if (braceEnd === -1) continue;

    // Parse config body
    const { properties, members } = parseConfigBody(
      code,
      braceStart + 1,
      braceEnd
    );

    const nameRange = makeRange(code, nameStrStart, nameStrEnd);

    const entry = {
      name,
      nameRange,
      properties,
      members,
    };

    if (constructType === "cube") {
      doc.cubes.push(entry as ParsedCube);
    } else {
      doc.views.push(entry as ParsedView);
    }

    // Advance regex past the closing paren of the call to avoid re-matching
    // The closing paren should be right after braceEnd
    const afterBrace = skipWS(code, braceEnd + 1);
    if (code[afterBrace] === ")") {
      callRegex.lastIndex = afterBrace + 1;
    } else {
      callRegex.lastIndex = braceEnd + 1;
    }
  }

  return doc;
}

// ---------------------------------------------------------------------------
// Cursor context
// ---------------------------------------------------------------------------

export function getCursorContext(
  doc: ParsedDocument,
  position: { lineNumber: number; column: number }
): CursorContext {
  const pos = position;

  // Check all cubes and views
  const allEntries: Array<{
    entry: ParsedCube | ParsedView;
    constructType: "cube" | "view";
  }> = [
    ...doc.cubes.map((c) => ({ entry: c, constructType: "cube" as const })),
    ...doc.views.map((v) => ({ entry: v, constructType: "view" as const })),
  ];

  for (const { entry, constructType } of allEntries) {
    // Check if position is within this cube/view's range
    // We need to check member groups and properties to determine context

    // Check member groups first (more specific)
    for (const [memberType, memberList] of Object.entries(entry.members)) {
      for (const member of memberList) {
        if (isPositionInRange(pos, member.range)) {
          // Check if inside a specific property value
          for (const prop of member.properties) {
            if (isPositionInRange(pos, prop.valueRange)) {
              // Check if it's a sql property with template literal
              if (prop.key === "sql") {
                const valueStr =
                  typeof prop.value === "string" ? prop.value : "";
                return buildSqlContext(
                  entry.name,
                  memberType,
                  member.name,
                  prop,
                  pos,
                  valueStr
                );
              }
              return {
                type: "property_value",
                cubeName: entry.name,
                memberType,
                memberName: member.name,
                propertyKey: prop.key,
              };
            }
            // Check if cursor is on the property line (key area)
            if (
              isPositionInRange(pos, prop.range) &&
              !isPositionInRange(pos, prop.valueRange)
            ) {
              // On the key side of a property — still member_body context
              continue;
            }
          }
          // Inside member but not in a specific property value — member_body
          const existingKeys = member.properties.map((p) => p.key);
          return {
            type: "member_body",
            cubeName: entry.name,
            memberType,
            memberName: member.name,
            existingKeys,
          };
        }
      }

      // Check if position is in the member group but not in any member
      // We need to check if cursor is between member definitions
      if (memberList.length > 0) {
        const firstMember = memberList[0];
        const lastMember = memberList[memberList.length - 1];
        // Rough check: if cursor is near the member list area
        if (
          isPositionAfterOrAt(pos, {
            lineNumber: firstMember.range.startLineNumber,
            column: 1,
          }) &&
          isPositionBeforeOrAt(pos, {
            lineNumber: lastMember.range.endLineNumber + 1,
            column: 1,
          })
        ) {
          // Verify it's not inside any member
          const inMember = memberList.some((m) =>
            isPositionInRange(pos, m.range)
          );
          if (!inMember) {
            return {
              type: "member_list",
              cubeName: entry.name,
              memberType,
            };
          }
        }
      }
    }

    // Check top-level properties
    for (const prop of entry.properties) {
      if (isPositionInRange(pos, prop.valueRange)) {
        if (prop.key === "sql" || prop.key === "sql_table") {
          const valueStr = typeof prop.value === "string" ? prop.value : "";
          return buildSqlContext(entry.name, null, null, prop, pos, valueStr);
        }
        return {
          type: "property_value",
          cubeName: entry.name,
          memberType: null,
          memberName: null,
          propertyKey: prop.key,
        };
      }
    }

    // Check if in cube root area — use nameRange and last property/member to bound
    if (isInCubeBody(entry, pos)) {
      return {
        type: "cube_root",
        cubeName: entry.name,
        constructType,
      };
    }
  }

  return { type: "unknown" };
}

function buildSqlContext(
  cubeName: string,
  memberType: string | null,
  memberName: string | null,
  prop: ParsedProperty,
  _pos: { lineNumber: number; column: number },
  valueStr: string
): CursorContext {
  // Detect template literal
  const isTemplateLiteral = valueStr.includes("${") || true; // In JS cube files, sql is always a template literal

  // Detect prefix (what's been typed after ${ )
  let prefix = "";
  // Look for incomplete template expression
  const lastDollarBrace = valueStr.lastIndexOf("${");
  if (lastDollarBrace !== -1) {
    const afterDollarBrace = valueStr.slice(lastDollarBrace + 2);
    if (!afterDollarBrace.includes("}")) {
      prefix = afterDollarBrace;
    }
  }

  return {
    type: "sql",
    cubeName,
    memberType,
    memberName,
    isTemplateLiteral,
    prefix,
  };
}

function isPositionInRange(
  pos: { lineNumber: number; column: number },
  range: MonacoRange
): boolean {
  if (pos.lineNumber < range.startLineNumber) return false;
  if (pos.lineNumber > range.endLineNumber) return false;
  if (
    pos.lineNumber === range.startLineNumber &&
    pos.column < range.startColumn
  )
    return false;
  if (pos.lineNumber === range.endLineNumber && pos.column > range.endColumn)
    return false;
  return true;
}

function isPositionAfterOrAt(
  pos: { lineNumber: number; column: number },
  ref: { lineNumber: number; column: number }
): boolean {
  if (pos.lineNumber > ref.lineNumber) return true;
  if (pos.lineNumber === ref.lineNumber && pos.column >= ref.column)
    return true;
  return false;
}

function isPositionBeforeOrAt(
  pos: { lineNumber: number; column: number },
  ref: { lineNumber: number; column: number }
): boolean {
  if (pos.lineNumber < ref.lineNumber) return true;
  if (pos.lineNumber === ref.lineNumber && pos.column <= ref.column)
    return true;
  return false;
}

function isInCubeBody(
  entry: ParsedCube | ParsedView,
  pos: { lineNumber: number; column: number }
): boolean {
  // The cube body starts after the name and extends to the end of all its content
  const nameEnd = entry.nameRange.endLineNumber;

  // Find the last line of any content in this cube/view
  let lastLine = nameEnd;
  let lastCol = entry.nameRange.endColumn;

  for (const prop of entry.properties) {
    if (
      prop.range.endLineNumber > lastLine ||
      (prop.range.endLineNumber === lastLine && prop.range.endColumn > lastCol)
    ) {
      lastLine = prop.range.endLineNumber;
      lastCol = prop.range.endColumn;
    }
  }

  for (const memberList of Object.values(entry.members)) {
    for (const member of memberList) {
      if (
        member.range.endLineNumber > lastLine ||
        (member.range.endLineNumber === lastLine &&
          member.range.endColumn > lastCol)
      ) {
        lastLine = member.range.endLineNumber;
        lastCol = member.range.endColumn;
      }
    }
  }

  // Add some slack for the closing braces
  lastLine += 2;

  return (
    isPositionAfterOrAt(pos, {
      lineNumber: nameEnd,
      column: entry.nameRange.endColumn,
    }) && isPositionBeforeOrAt(pos, { lineNumber: lastLine, column: 999 })
  );
}
