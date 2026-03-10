import { describe, it, expect } from "vitest";

import {
  parseJsDocument,
  getCursorContext,
  offsetToPosition,
} from "../jsParser";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ORDERS_CUBE = `cube(\`orders\`, {
  sql_table: \`public.orders\`,

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: \`number\`,
      primary_key: true,
    },
    status: {
      sql: \`\${CUBE}.status\`,
      type: \`string\`,
    },
  },

  measures: {
    count: {
      type: \`count\`,
    },
    total_amount: {
      sql: \`\${CUBE}.amount\`,
      type: \`sum\`,
    },
  },

  joins: {
    users: {
      sql: \`\${CUBE}.user_id = \${users.id}\`,
      relationship: \`many_to_one\`,
    },
  },
});`;

const VIEW_ONLY = `view(\`orders_view\`, {
  cubes: [
    {
      join_path: () => orders,
      includes: \`*\`,
    },
  ],
});`;

const MULTI_BLOCK = `${ORDERS_CUBE}

${VIEW_ONLY}`;

const NESTED_BRACES = `cube(\`nested\`, {
  sql_table: \`public.nested\`,
  dimensions: {
    computed: {
      sql: \`CASE WHEN \${CUBE}.x > 0 THEN JSON_EXTRACT(col, '$.a') ELSE '{}' END\`,
      type: \`string\`,
    },
  },
});`;

const FILTER_PARAMS_CUBE = `cube(\`filtered\`, {
  sql: \`SELECT * FROM orders WHERE \${FILTER_PARAMS.orders.status.filter('status')}\`,
  dimensions: {
    status: {
      sql: \`\${CUBE}.status\`,
      type: \`string\`,
    },
  },
});`;

// ---------------------------------------------------------------------------
// T008 Test Cases
// ---------------------------------------------------------------------------

describe("jsParser", () => {
  // 1. Parse a cube with dimensions, measures, joins
  describe("parseJsDocument — cube with dimensions, measures, joins", () => {
    it("extracts the cube name and all member groups", () => {
      const doc = parseJsDocument(ORDERS_CUBE);

      expect(doc.format).toBe("js");
      expect(doc.cubes).toHaveLength(1);
      expect(doc.views).toHaveLength(0);
      expect(doc.errors).toHaveLength(0);

      const cube = doc.cubes[0];
      expect(cube.name).toBe("orders");

      // Top-level property
      expect(cube.properties.some((p) => p.key === "sql_table")).toBe(true);
      const sqlTable = cube.properties.find((p) => p.key === "sql_table")!;
      expect(sqlTable.value).toBe("public.orders");

      // Dimensions
      expect(cube.members.dimensions).toHaveLength(2);
      expect(cube.members.dimensions[0].name).toBe("id");
      expect(cube.members.dimensions[1].name).toBe("status");

      // id dimension properties
      const idDim = cube.members.dimensions[0];
      expect(idDim.properties.some((p) => p.key === "sql")).toBe(true);
      expect(idDim.properties.some((p) => p.key === "type")).toBe(true);
      expect(idDim.properties.some((p) => p.key === "primary_key")).toBe(true);
      const pk = idDim.properties.find((p) => p.key === "primary_key")!;
      expect(pk.value).toBe(true);

      // Measures
      expect(cube.members.measures).toHaveLength(2);
      expect(cube.members.measures[0].name).toBe("count");
      expect(cube.members.measures[1].name).toBe("total_amount");

      // Joins
      expect(cube.members.joins).toHaveLength(1);
      expect(cube.members.joins[0].name).toBe("users");
      const joinSql = cube.members.joins[0].properties.find(
        (p) => p.key === "sql"
      )!;
      expect(joinSql.value).toContain("${CUBE}");
    });
  });

  // 2. Parse a view call
  describe("parseJsDocument — view", () => {
    it("extracts the view name and top-level properties", () => {
      const doc = parseJsDocument(VIEW_ONLY);

      expect(doc.views).toHaveLength(1);
      expect(doc.cubes).toHaveLength(0);

      const view = doc.views[0];
      expect(view.name).toBe("orders_view");
      // cubes is an array property, not a member group
      expect(view.properties.some((p) => p.key === "cubes")).toBe(true);
    });
  });

  // 3. Multiple cube/view calls in one file
  describe("parseJsDocument — multiple blocks", () => {
    it("parses both cube and view from one file", () => {
      const doc = parseJsDocument(MULTI_BLOCK);

      expect(doc.cubes).toHaveLength(1);
      expect(doc.views).toHaveLength(1);
      expect(doc.cubes[0].name).toBe("orders");
      expect(doc.views[0].name).toBe("orders_view");
    });
  });

  // 4. Brace matching with nested braces
  describe("parseJsDocument — nested braces", () => {
    it("correctly extracts config even with nested braces in sql strings", () => {
      const doc = parseJsDocument(NESTED_BRACES);

      expect(doc.cubes).toHaveLength(1);
      const cube = doc.cubes[0];
      expect(cube.name).toBe("nested");
      expect(cube.members.dimensions).toHaveLength(1);
      expect(cube.members.dimensions[0].name).toBe("computed");
    });
  });

  // 5. Source position tracking
  describe("parseJsDocument — source positions", () => {
    it("tracks cube name position", () => {
      const doc = parseJsDocument(ORDERS_CUBE);
      const cube = doc.cubes[0];

      // cube(`orders`, ...) — name starts at the backtick on line 1
      expect(cube.nameRange.startLineNumber).toBe(1);
      expect(cube.nameRange.startColumn).toBe(6); // position of opening backtick
    });

    it("tracks property positions", () => {
      const doc = parseJsDocument(ORDERS_CUBE);
      const cube = doc.cubes[0];
      const sqlTable = cube.properties.find((p) => p.key === "sql_table")!;

      // sql_table is on line 2
      expect(sqlTable.range.startLineNumber).toBe(2);
    });
  });

  // 6. Template literal detection
  describe("parseJsDocument — template literals", () => {
    it("detects ${CUBE} in sql values", () => {
      const doc = parseJsDocument(ORDERS_CUBE);
      const idDim = doc.cubes[0].members.dimensions[0];
      const sqlProp = idDim.properties.find((p) => p.key === "sql")!;
      expect(String(sqlProp.value)).toContain("${CUBE}");
    });

    it("detects ${FILTER_PARAMS...} in sql values", () => {
      const doc = parseJsDocument(FILTER_PARAMS_CUBE);
      const cube = doc.cubes[0];
      const sqlProp = cube.properties.find((p) => p.key === "sql")!;
      expect(String(sqlProp.value)).toContain("${FILTER_PARAMS");
    });
  });

  // 7–11: getCursorContext tests
  describe("getCursorContext", () => {
    // 7. cube_root
    it("returns cube_root when cursor is between top-level properties", () => {
      // Place cursor on the blank line between sql_table and dimensions (line 3)
      const doc = parseJsDocument(ORDERS_CUBE);
      const ctx = getCursorContext(doc, { lineNumber: 3, column: 1 });
      expect(ctx.type).toBe("cube_root");
      if (ctx.type === "cube_root") {
        expect(ctx.cubeName).toBe("orders");
        expect(ctx.constructType).toBe("cube");
      }
    });

    // 8. member_list
    it("returns member_list when cursor is between member definitions", () => {
      // In the dimensions block, find a position between id and status members
      // id ends around line 9, status starts around line 10
      // Let's use line 9 column 5 (the comma line after id member)
      parseJsDocument(ORDERS_CUBE);

      // Use a position that is inside the dimensions block but not inside any member
      // The blank area or comma between members
      // Actually, members are contiguous. Let's use a line right after the last member ends
      // but before the closing brace of dimensions.
      // Dimensions closing brace is around line 15. Let's try line 14 col 5 after status ends.
      // This is hard to pinpoint without exact offsets, so let's construct a targeted example.
      const targetCode = `cube(\`test\`, {
  dimensions: {
    id: {
      type: \`number\`,
    },

    status: {
      type: \`string\`,
    },
  },
});`;
      const targetDoc = parseJsDocument(targetCode);
      // Line 6 is the blank line between id and status members
      const ctx = getCursorContext(targetDoc, { lineNumber: 6, column: 3 });
      expect(ctx.type).toBe("member_list");
      if (ctx.type === "member_list") {
        expect(ctx.cubeName).toBe("test");
        expect(ctx.memberType).toBe("dimensions");
      }
    });

    // 9. member_body with existingKeys
    it("returns member_body with existingKeys when cursor is inside a member", () => {
      const doc = parseJsDocument(ORDERS_CUBE);
      // id dimension body — pick a line inside the id member block
      const idDim = doc.cubes[0].members.dimensions[0];
      // Place cursor inside the member body, between existing properties
      // Use a line that's clearly between the start and end of the member
      const midLine = Math.floor(
        (idDim.range.startLineNumber + idDim.range.endLineNumber) / 2
      );
      const ctx = getCursorContext(doc, {
        lineNumber: midLine,
        column: idDim.range.startColumn + 4,
      });
      expect(ctx.type).toBe("member_body");
      if (ctx.type === "member_body") {
        expect(ctx.cubeName).toBe("orders");
        expect(ctx.memberType).toBe("dimensions");
        expect(ctx.memberName).toBe("id");
        expect(ctx.existingKeys).toContain("sql");
        expect(ctx.existingKeys).toContain("type");
        expect(ctx.existingKeys).toContain("primary_key");
      }
    });

    // 10. property_value
    it("returns property_value when cursor is on a property value", () => {
      const doc = parseJsDocument(ORDERS_CUBE);
      // type: `number` on the id dimension — find its value range
      const idDim = doc.cubes[0].members.dimensions[0];
      const typeProp = idDim.properties.find((p) => p.key === "type")!;
      const ctx = getCursorContext(doc, {
        lineNumber: typeProp.valueRange.startLineNumber,
        column: typeProp.valueRange.startColumn + 1,
      });
      expect(ctx.type).toBe("property_value");
      if (ctx.type === "property_value") {
        expect(ctx.cubeName).toBe("orders");
        expect(ctx.memberType).toBe("dimensions");
        expect(ctx.memberName).toBe("id");
        expect(ctx.propertyKey).toBe("type");
      }
    });

    // 11. sql context with template literal
    it("returns sql context with isTemplateLiteral when cursor is in sql value", () => {
      const doc = parseJsDocument(ORDERS_CUBE);
      const idDim = doc.cubes[0].members.dimensions[0];
      const sqlProp = idDim.properties.find((p) => p.key === "sql")!;
      const ctx = getCursorContext(doc, {
        lineNumber: sqlProp.valueRange.startLineNumber,
        column: sqlProp.valueRange.startColumn + 1,
      });
      expect(ctx.type).toBe("sql");
      if (ctx.type === "sql") {
        expect(ctx.cubeName).toBe("orders");
        expect(ctx.memberType).toBe("dimensions");
        expect(ctx.memberName).toBe("id");
        expect(ctx.isTemplateLiteral).toBe(true);
      }
    });
  });

  // 12. Graceful handling of unparseable sections
  describe("parseJsDocument — unparseable sections ignored", () => {
    it("ignores code outside cube()/view() calls", () => {
      const code = `
import { something } from 'somewhere';

const x = { a: 1, b: 2 };

cube(\`orders\`, {
  sql_table: \`public.orders\`,
});

function helper() { return 42; }
`;
      const doc = parseJsDocument(code);
      expect(doc.cubes).toHaveLength(1);
      expect(doc.cubes[0].name).toBe("orders");
      expect(doc.errors).toHaveLength(0);
    });
  });

  // 13. Empty file
  describe("parseJsDocument — empty file", () => {
    it("returns empty ParsedDocument", () => {
      const emptyDoc = parseJsDocument("");
      expect(emptyDoc.format).toBe("js");
      expect(emptyDoc.cubes).toHaveLength(0);
      expect(emptyDoc.views).toHaveLength(0);
      expect(emptyDoc.errors).toHaveLength(0);
    });
  });

  // 14. File with only comments/imports
  describe("parseJsDocument — only comments and imports", () => {
    it("returns empty ParsedDocument", () => {
      const code = `
// This is a comment
/* Block comment */
import { something } from 'somewhere';

const config = { key: 'value' };
`;
      const doc = parseJsDocument(code);
      expect(doc.cubes).toHaveLength(0);
      expect(doc.views).toHaveLength(0);
      expect(doc.errors).toHaveLength(0);
    });
  });

  // offsetToPosition helper
  describe("offsetToPosition", () => {
    it("converts offset to line/column correctly", () => {
      const code = "abc\ndef\nghi";
      expect(offsetToPosition(code, 0)).toEqual({ lineNumber: 1, column: 1 });
      expect(offsetToPosition(code, 3)).toEqual({ lineNumber: 1, column: 4 });
      expect(offsetToPosition(code, 4)).toEqual({ lineNumber: 2, column: 1 });
      expect(offsetToPosition(code, 7)).toEqual({ lineNumber: 2, column: 4 });
      expect(offsetToPosition(code, 8)).toEqual({ lineNumber: 3, column: 1 });
    });
  });
});
