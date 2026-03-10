import { describe, it, expect } from "vitest";

import { getCompletions, type CompletionItem } from "../completionProvider";
import { CubeRegistry, type FetchMetaCube } from "../registry";

import type { CursorContext } from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRegistry(cubes: FetchMetaCube[] = []): CubeRegistry {
  const reg = new CubeRegistry();
  if (cubes.length > 0) reg.populate(cubes);
  return reg;
}

const emptyRegistry = makeRegistry();

const sampleCubes: FetchMetaCube[] = [
  {
    name: "Orders",
    title: "Orders",
    type: "cube",
    dimensions: [
      { name: "id", type: "number", primaryKey: true },
      { name: "status", type: "string" },
    ],
    measures: [
      { name: "count", type: "count" },
      { name: "totalAmount", type: "sum" },
    ],
    segments: [{ name: "completed" }],
  },
  {
    name: "Users",
    title: "Users",
    type: "cube",
    dimensions: [
      { name: "id", type: "number", primaryKey: true },
      { name: "email", type: "string" },
    ],
    measures: [{ name: "count", type: "count" }],
    segments: [],
  },
];

function labels(items: CompletionItem[]): string[] {
  return items.map((i) => i.label);
}

// ---------------------------------------------------------------------------
// 1. cube_root context
// ---------------------------------------------------------------------------

describe("cube_root completions", () => {
  it("returns top-level cube properties with descriptions (YAML)", () => {
    const ctx: CursorContext = {
      type: "cube_root",
      cubeName: "Orders",
      constructType: "cube",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    expect(items.length).toBeGreaterThan(0);
    // Should contain fundamental cube properties
    const labelList = labels(items);
    expect(labelList).toContain("sql_table");
    expect(labelList).toContain("dimensions");
    expect(labelList).toContain("measures");
    expect(labelList).toContain("joins");
    expect(labelList).toContain("segments");
    expect(labelList).toContain("pre_aggregations");
    expect(labelList).toContain("title");
    expect(labelList).toContain("description");

    // Every item should have documentation
    for (const item of items) {
      expect(item.documentation).toBeTruthy();
    }
  });

  it("returns top-level view properties for view constructType", () => {
    const ctx: CursorContext = {
      type: "cube_root",
      cubeName: "OrdersView",
      constructType: "view",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("cubes");
    expect(labelList).toContain("folders");
  });

  it("excludes deprecated properties", () => {
    const ctx: CursorContext = {
      type: "cube_root",
      cubeName: "Orders",
      constructType: "cube",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);
    const labelList = labels(items);
    expect(labelList).not.toContain("shown");
  });
});

// ---------------------------------------------------------------------------
// 2. member_list context — dimensions
// ---------------------------------------------------------------------------

describe("member_list completions (dimensions)", () => {
  it("returns a dimension skeleton snippet (YAML)", () => {
    const ctx: CursorContext = {
      type: "member_list",
      cubeName: "Orders",
      memberType: "dimensions",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    expect(items).toHaveLength(1);
    const skel = items[0];
    expect(skel.kind).toBe("snippet");
    expect(skel.isSnippet).toBe(true);
    expect(skel.insertText).toContain("name:");
    expect(skel.insertText).toContain("sql:");
    expect(skel.insertText).toContain("type:");
  });
});

// ---------------------------------------------------------------------------
// 3. member_list context — measures
// ---------------------------------------------------------------------------

describe("member_list completions (measures)", () => {
  it("returns a measure skeleton snippet (YAML)", () => {
    const ctx: CursorContext = {
      type: "member_list",
      cubeName: "Orders",
      memberType: "measures",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    expect(items).toHaveLength(1);
    const skel = items[0];
    expect(skel.kind).toBe("snippet");
    expect(skel.isSnippet).toBe(true);
    expect(skel.insertText).toContain("name:");
    expect(skel.insertText).toContain("type:");
  });
});

// ---------------------------------------------------------------------------
// 4. member_list context — joins
// ---------------------------------------------------------------------------

describe("member_list completions (joins)", () => {
  it("returns a join skeleton snippet (YAML)", () => {
    const ctx: CursorContext = {
      type: "member_list",
      cubeName: "Orders",
      memberType: "joins",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    expect(items).toHaveLength(1);
    const skel = items[0];
    expect(skel.kind).toBe("snippet");
    expect(skel.isSnippet).toBe(true);
    expect(skel.insertText).toContain("name:");
    expect(skel.insertText).toContain("sql:");
    expect(skel.insertText).toContain("relationship:");
  });
});

// ---------------------------------------------------------------------------
// 5. member_body context — dimension (excludes existingKeys)
// ---------------------------------------------------------------------------

describe("member_body completions (dimension)", () => {
  it("returns valid dimension properties, excluding already-present keys", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "status",
      existingKeys: ["sql", "type"],
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    // Should NOT contain sql or type since they're in existingKeys
    expect(labelList).not.toContain("sql");
    expect(labelList).not.toContain("type");
    // Should contain other valid dimension properties
    expect(labelList).toContain("primary_key");
    expect(labelList).toContain("title");
    expect(labelList).toContain("description");
    expect(labelList).toContain("public");
  });
});

// ---------------------------------------------------------------------------
// 6. member_body context — measure
// ---------------------------------------------------------------------------

describe("member_body completions (measure)", () => {
  it("returns valid measure properties", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "measures",
      memberName: "count",
      existingKeys: [],
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("sql");
    expect(labelList).toContain("type");
    expect(labelList).toContain("title");
    expect(labelList).toContain("rolling_window");
    expect(labelList).toContain("drill_members");
  });
});

// ---------------------------------------------------------------------------
// 7. property_value — dimension type
// ---------------------------------------------------------------------------

describe("property_value completions (dimension type)", () => {
  it("returns dimension type enum values", () => {
    const ctx: CursorContext = {
      type: "property_value",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "status",
      propertyKey: "type",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("string");
    expect(labelList).toContain("number");
    expect(labelList).toContain("boolean");
    expect(labelList).toContain("time");
    expect(labelList).toContain("geo");
    expect(items).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// 8. property_value — measure type
// ---------------------------------------------------------------------------

describe("property_value completions (measure type)", () => {
  it("returns measure type enum values", () => {
    const ctx: CursorContext = {
      type: "property_value",
      cubeName: "Orders",
      memberType: "measures",
      memberName: "totalAmount",
      propertyKey: "type",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("count");
    expect(labelList).toContain("sum");
    expect(labelList).toContain("avg");
    expect(labelList).toContain("min");
    expect(labelList).toContain("max");
    expect(labelList).toContain("countDistinct");
    expect(labelList).toContain("countDistinctApprox");
    expect(labelList).toContain("runningTotal");
    expect(labelList).toContain("number");
    expect(labelList).toContain("numberAgg");
    expect(labelList).toContain("rank");
  });
});

// ---------------------------------------------------------------------------
// 9. property_value — relationship
// ---------------------------------------------------------------------------

describe("property_value completions (relationship)", () => {
  it("returns all 12 relationship values", () => {
    const ctx: CursorContext = {
      type: "property_value",
      cubeName: "Orders",
      memberType: "joins",
      memberName: "users",
      propertyKey: "relationship",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    expect(items).toHaveLength(12);
    const labelList = labels(items);
    expect(labelList).toContain("belongsTo");
    expect(labelList).toContain("belongs_to");
    expect(labelList).toContain("many_to_one");
    expect(labelList).toContain("manyToOne");
    expect(labelList).toContain("hasMany");
    expect(labelList).toContain("has_many");
    expect(labelList).toContain("one_to_many");
    expect(labelList).toContain("oneToMany");
    expect(labelList).toContain("hasOne");
    expect(labelList).toContain("has_one");
    expect(labelList).toContain("one_to_one");
    expect(labelList).toContain("oneToOne");
  });
});

// ---------------------------------------------------------------------------
// 10. sql context — template variables
// ---------------------------------------------------------------------------

describe("sql context completions", () => {
  it("returns template variables (CUBE, FILTER_PARAMS, etc.)", () => {
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "id",
      isTemplateLiteral: true,
      prefix: "",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("CUBE");
    expect(labelList).toContain("FILTER_PARAMS");
    expect(labelList).toContain("SECURITY_CONTEXT");
    expect(labelList).toContain("SQL_UTILS");
    expect(labelList).toContain("COMPILE_CONTEXT");
  });

  // ---------------------------------------------------------------------------
  // 11. sql context with prefix "CUBE." — returns nothing
  // ---------------------------------------------------------------------------

  it("returns nothing for CUBE. prefix", () => {
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "id",
      isTemplateLiteral: true,
      prefix: "CUBE.",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    expect(items).toHaveLength(0);
  });

  // ---------------------------------------------------------------------------
  // 12. sql context with cube name from registry
  // ---------------------------------------------------------------------------

  it('returns cube names from registry after "${" prefix', () => {
    const registry = makeRegistry(sampleCubes);
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "id",
      isTemplateLiteral: true,
      prefix: "",
    };
    const items = getCompletions(ctx, "yaml", registry);

    const labelList = labels(items);
    expect(labelList).toContain("Orders");
    expect(labelList).toContain("Users");
  });

  it("returns cube members when prefix is a known cube name with dot", () => {
    const registry = makeRegistry(sampleCubes);
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "id",
      isTemplateLiteral: true,
      prefix: "Orders.",
    };
    const items = getCompletions(ctx, "yaml", registry);

    const labelList = labels(items);
    expect(labelList).toContain("Orders.id");
    expect(labelList).toContain("Orders.status");
    expect(labelList).toContain("Orders.count");
    expect(labelList).toContain("Orders.totalAmount");
    expect(labelList).toContain("Orders.completed");
  });
});

// ---------------------------------------------------------------------------
// 13. YAML format — snake_case keys
// ---------------------------------------------------------------------------

describe("format handling", () => {
  it("returns snake_case keys for YAML format", () => {
    const ctx: CursorContext = {
      type: "cube_root",
      cubeName: "Orders",
      constructType: "cube",
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("sql_table");
    expect(labelList).toContain("data_source");
    expect(labelList).toContain("pre_aggregations");
    expect(labelList).toContain("refresh_key");
    // Should NOT have camelCase versions
    expect(labelList).not.toContain("sqlTable");
    expect(labelList).not.toContain("dataSource");
  });

  // ---------------------------------------------------------------------------
  // 14. JS format — camelCase keys
  // ---------------------------------------------------------------------------

  it("returns camelCase keys for JS format", () => {
    const ctx: CursorContext = {
      type: "cube_root",
      cubeName: "Orders",
      constructType: "cube",
    };
    const items = getCompletions(ctx, "js", emptyRegistry);

    const labelList = labels(items);
    expect(labelList).toContain("sqlTable");
    expect(labelList).toContain("dataSource");
    expect(labelList).toContain("preAggregations");
    expect(labelList).toContain("refreshKey");
    // Should NOT have snake_case versions
    expect(labelList).not.toContain("sql_table");
    expect(labelList).not.toContain("data_source");
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("edge cases", () => {
  it("returns empty array for unknown context", () => {
    const ctx: CursorContext = { type: "unknown" };
    const items = getCompletions(ctx, "yaml", emptyRegistry);
    expect(items).toEqual([]);
  });

  it("member_body for pre_aggregations works with snake_case memberType", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "pre_aggregations",
      memberName: "main",
      existingKeys: ["type"],
    };
    const items = getCompletions(ctx, "yaml", emptyRegistry);
    const labelList = labels(items);
    expect(labelList).toContain("measures");
    expect(labelList).toContain("dimensions");
    expect(labelList).not.toContain("type");
  });

  it("member_list skeleton for JS format", () => {
    const ctx: CursorContext = {
      type: "member_list",
      cubeName: "Orders",
      memberType: "dimensions",
    };
    const items = getCompletions(ctx, "js", emptyRegistry);

    expect(items).toHaveLength(1);
    const skel = items[0];
    expect(skel.kind).toBe("snippet");
    expect(skel.isSnippet).toBe(true);
    expect(skel.insertText).toContain("sql:");
    expect(skel.insertText).toContain("type:");
  });
});
