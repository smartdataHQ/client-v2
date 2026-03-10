import { describe, it, expect } from "vitest";

import {
  parseYamlDocument,
  getCursorContext,
  offsetToPosition,
} from "../yamlParser";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const BASIC_CUBE = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        primary_key: true

      - name: status
        sql: "\${CUBE}.status"
        type: string

    measures:
      - name: count
        type: count

      - name: total_amount
        sql: "\${CUBE}.amount"
        type: sum

    joins:
      - name: users
        sql: "\${CUBE}.user_id = \${users.id}"
        relationship: many_to_one

    segments:
      - name: active
        sql: "\${CUBE}.status = 'active'"
`;

const BASIC_VIEW = `views:
  - name: orders_view
    cubes:
      - join_path: orders
        includes: "*"
`;

const MULTI_CUBE = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number

  - name: users
    sql_table: public.users

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number

      - name: email
        sql: "\${CUBE}.email"
        type: string
`;

// ---------------------------------------------------------------------------
// T006: Tests
// ---------------------------------------------------------------------------

describe("parseYamlDocument", () => {
  it("parses a cube with dimensions, measures, joins, segments", () => {
    const doc = parseYamlDocument(BASIC_CUBE);

    expect(doc.format).toBe("yaml");
    expect(doc.errors).toHaveLength(0);
    expect(doc.cubes).toHaveLength(1);
    expect(doc.views).toHaveLength(0);

    const cube = doc.cubes[0];
    expect(cube.name).toBe("orders");

    // Top-level properties (name, sql_table)
    expect(cube.properties.map((p) => p.key)).toContain("name");
    expect(cube.properties.map((p) => p.key)).toContain("sql_table");

    // Dimensions
    expect(cube.members.dimensions).toHaveLength(2);
    expect(cube.members.dimensions[0].name).toBe("id");
    expect(cube.members.dimensions[1].name).toBe("status");

    // Measures
    expect(cube.members.measures).toHaveLength(2);
    expect(cube.members.measures[0].name).toBe("count");
    expect(cube.members.measures[1].name).toBe("total_amount");

    // Joins
    expect(cube.members.joins).toHaveLength(1);
    expect(cube.members.joins[0].name).toBe("users");
    const joinRelProp = cube.members.joins[0].properties.find(
      (p) => p.key === "relationship"
    );
    expect(joinRelProp?.value).toBe("many_to_one");

    // Segments
    expect(cube.members.segments).toHaveLength(1);
    expect(cube.members.segments[0].name).toBe("active");
  });

  it("parses a view with cubes array", () => {
    const doc = parseYamlDocument(BASIC_VIEW);

    expect(doc.errors).toHaveLength(0);
    expect(doc.views).toHaveLength(1);

    const view = doc.views[0];
    expect(view.name).toBe("orders_view");
    // "cubes" is not a member group key, but views treat it differently.
    // In our parser, cubes in views are stored as properties since they aren't
    // one of the standard member group keys (dimensions, measures, etc.)
    // The view's cubes property should exist
    const cubesProp = view.properties.find((p) => p.key === "cubes");
    expect(cubesProp).toBeDefined();
  });

  it("tracks source positions correctly", () => {
    const doc = parseYamlDocument(BASIC_CUBE);
    const cube = doc.cubes[0];

    // name property should be on line 2
    const nameProp = cube.properties.find((p) => p.key === "name");
    expect(nameProp).toBeDefined();
    expect(nameProp!.range.startLineNumber).toBe(2);

    // sql_table property should be on line 3
    const sqlTableProp = cube.properties.find((p) => p.key === "sql_table");
    expect(sqlTableProp).toBeDefined();
    expect(sqlTableProp!.range.startLineNumber).toBe(3);

    // First dimension should start at line 6
    const firstDim = cube.members.dimensions[0];
    expect(firstDim.range.startLineNumber).toBe(6);

    // nameRange for the first dimension should point to "id" value
    expect(firstDim.nameRange.startLineNumber).toBe(6);
  });

  it("handles empty file", () => {
    const doc = parseYamlDocument("");
    expect(doc.format).toBe("yaml");
    expect(doc.cubes).toHaveLength(0);
    expect(doc.views).toHaveLength(0);
    expect(doc.errors).toHaveLength(0);
  });

  it("handles whitespace-only file", () => {
    const doc = parseYamlDocument("   \n\n  ");
    expect(doc.cubes).toHaveLength(0);
    expect(doc.views).toHaveLength(0);
    expect(doc.errors).toHaveLength(0);
  });

  it("handles invalid YAML gracefully", () => {
    const invalid = `cubes:
  - name: orders
    dimensions:
      - name: id
        sql: "\${CUBE}.id"
  invalid_indent
    extra: stuff
      broken:
        - [unterminated`;
    const doc = parseYamlDocument(invalid);
    expect(doc.errors.length).toBeGreaterThan(0);
    // Should not throw
    expect(doc.format).toBe("yaml");
  });

  it("parses multiple cubes in one file", () => {
    const doc = parseYamlDocument(MULTI_CUBE);

    expect(doc.errors).toHaveLength(0);
    expect(doc.cubes).toHaveLength(2);

    expect(doc.cubes[0].name).toBe("orders");
    expect(doc.cubes[0].members.dimensions).toHaveLength(1);

    expect(doc.cubes[1].name).toBe("users");
    expect(doc.cubes[1].members.dimensions).toHaveLength(2);
    expect(doc.cubes[1].members.dimensions[1].name).toBe("email");
  });
});

describe("getCursorContext", () => {
  it("returns cube_root when cursor is at cube root level", () => {
    // Position cursor on the sql_table line (line 3), which is a top-level property
    // but between top-level properties — place cursor at start of a new line after sql_table
    const code = BASIC_CUBE;
    const doc = parseYamlDocument(code);

    // Line 4 is an empty line between sql_table and dimensions — this is cube root
    const ctx = getCursorContext(doc, { lineNumber: 4, column: 5 }, code);
    expect(ctx.type).toBe("cube_root");
    if (ctx.type === "cube_root") {
      expect(ctx.cubeName).toBe("orders");
      expect(ctx.constructType).toBe("cube");
    }
  });

  it("returns member_list when cursor is between members", () => {
    const code = BASIC_CUBE;
    const doc = parseYamlDocument(code);

    // Line 10 is the empty line between the "id" dimension and "status" dimension
    const ctx = getCursorContext(doc, { lineNumber: 10, column: 7 }, code);
    expect(ctx.type).toBe("member_list");
    if (ctx.type === "member_list") {
      expect(ctx.cubeName).toBe("orders");
      expect(ctx.memberType).toBe("dimensions");
    }
  });

  it("returns member_body when cursor is inside a member", () => {
    const code = BASIC_CUBE;
    const doc = parseYamlDocument(code);

    // Line 8 is "type: number" inside the "id" dimension — but on the line itself,
    // let's pick line 9 which is "primary_key: true" — actually let's be
    // inside the member range but between existing properties.
    // Line 6 is "- name: id", line 7 is "sql:", line 8 is "type:", line 9 is "primary_key:"
    // The member body context should fire if we are in the member's range
    // but not directly on a value. Let's place cursor at the beginning of line 9.
    getCursorContext(doc, { lineNumber: 9, column: 9 }, code);
    // Could be property_value for primary_key or member_body
    // At column 9, that's the start of "primary_key" key area
    // Let's try a position that's clearly within the member but not on a value
    getCursorContext(doc, { lineNumber: 8, column: 9 }, code);
    // This would be on the "type" property value position
    // For member_body, we need to be inside the member range but not on any property value
    // Let's try with a simple test document where we can control positions precisely.
    // Place cursor on a line inside the member but at the start of a property key,
    // which is within the member range but not on a value.
    const simpleCode = [
      "cubes:", // 1
      "  - name: test_cube", // 2
      "    dimensions:", // 3
      "      - name: id", // 4
      '        sql: "${CUBE}.id"', // 5
      "        type: number", // 6
      "        primary_key: true", // 7
    ].join("\n");
    const simpleDoc = parseYamlDocument(simpleCode);
    // Place cursor at start of line 6, column 9 — on the "type" key area.
    // This is inside the member range but the position is on the key, not the value.
    // Actually, let's pick a column that's before the key starts — column 1 on line 6.
    // But the member range starts at column ~7. Let's use column 9 on line 7
    // which is on "primary_key" key — within the member range.
    // The member range should encompass lines 4-7. Column 9 on line 6 is on the "t" of "type".
    // That is within the member range, and the value "number" starts later on the line.
    // Since column 9 is before the value range of "type", it should be member_body.
    const ctx3 = getCursorContext(
      simpleDoc,
      { lineNumber: 6, column: 9 },
      simpleCode
    );
    expect(ctx3.type).toBe("member_body");
    if (ctx3.type === "member_body") {
      expect(ctx3.cubeName).toBe("test_cube");
      expect(ctx3.memberType).toBe("dimensions");
      expect(ctx3.memberName).toBe("id");
      expect(ctx3.existingKeys).toContain("name");
      expect(ctx3.existingKeys).toContain("sql");
      expect(ctx3.existingKeys).toContain("type");
    }
  });

  it("returns property_value when cursor is on a value", () => {
    const code = BASIC_CUBE;
    const doc = parseYamlDocument(code);

    // Line 3 has "sql_table: public.orders", value starts after "sql_table: "
    // The value "public.orders" is on line 3
    const ctx = getCursorContext(doc, { lineNumber: 3, column: 18 }, code);
    expect(ctx.type).toBe("property_value");
    if (ctx.type === "property_value") {
      expect(ctx.cubeName).toBe("orders");
      expect(ctx.propertyKey).toBe("sql_table");
    }
  });

  it("returns sql context when cursor is inside a sql value", () => {
    const code = [
      "cubes:",
      "  - name: orders",
      "    dimensions:",
      "      - name: id",
      '        sql: "${CUBE}.id"',
      "        type: number",
    ].join("\n");
    const doc = parseYamlDocument(code);

    // Line 5: `        sql: "${CUBE}.id"`
    // The value starts after "sql: ", position within the quoted string
    const ctx = getCursorContext(doc, { lineNumber: 5, column: 20 }, code);
    expect(ctx.type).toBe("sql");
    if (ctx.type === "sql") {
      expect(ctx.cubeName).toBe("orders");
      expect(ctx.memberType).toBe("dimensions");
      expect(ctx.memberName).toBe("id");
    }
  });

  it("returns sql context with template literal prefix", () => {
    const code = [
      "cubes:",
      "  - name: orders",
      "    dimensions:",
      "      - name: id",
      '        sql: "${CUBE}.id + ${us"',
      "        type: number",
    ].join("\n");
    const doc = parseYamlDocument(code);

    // Position cursor right after "${us" — the template literal with prefix "us"
    // Line 5: `        sql: "${CUBE}.id + ${us"`
    // Find the position of "us" at the end
    const line = code.split("\n")[4]; // 0-based index 4 = line 5
    const usIdx = line.lastIndexOf("us");
    // Column is 1-based, so after "us" = usIdx + 2 + 1
    const col = usIdx + 2 + 1;
    const ctx = getCursorContext(doc, { lineNumber: 5, column: col }, code);
    expect(ctx.type).toBe("sql");
    if (ctx.type === "sql") {
      expect(ctx.isTemplateLiteral).toBe(true);
      expect(ctx.prefix).toBe("us");
    }
  });

  it("returns unknown for positions outside any construct", () => {
    const doc = parseYamlDocument(BASIC_CUBE);
    // Line 1 is "cubes:" — the root key, not inside any cube
    const ctx = getCursorContext(doc, { lineNumber: 1, column: 1 }, BASIC_CUBE);
    expect(ctx.type).toBe("unknown");
  });
});

describe("offsetToPosition", () => {
  it("converts offset 0 to line 1 column 1", () => {
    expect(offsetToPosition("hello", 0)).toEqual({ lineNumber: 1, column: 1 });
  });

  it("converts offsets across newlines", () => {
    const code = "ab\ncd\nef";
    expect(offsetToPosition(code, 0)).toEqual({ lineNumber: 1, column: 1 });
    expect(offsetToPosition(code, 2)).toEqual({ lineNumber: 1, column: 3 }); // at '\n'
    expect(offsetToPosition(code, 3)).toEqual({ lineNumber: 2, column: 1 }); // 'c'
    expect(offsetToPosition(code, 6)).toEqual({ lineNumber: 3, column: 1 }); // 'e'
  });
});
