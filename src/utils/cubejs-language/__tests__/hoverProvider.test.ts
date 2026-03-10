import { describe, it, expect } from "vitest";

import { getHoverInfo } from "../hoverProvider";
import { CubeRegistry, type FetchMetaCube } from "../registry";
import { cubeJsSpec } from "../spec";

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
      { name: "created_at", type: "time" },
    ],
    measures: [
      { name: "count", type: "count" },
      { name: "total_amount", type: "sum" },
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

const populatedRegistry = makeRegistry(sampleCubes);

// ---------------------------------------------------------------------------
// 1. Hovering over `relationship` property in a join
// ---------------------------------------------------------------------------

describe("property hover: relationship", () => {
  it("shows description and valid values for relationship in a join", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "joins",
      memberName: "users",
      existingKeys: ["sql", "relationship"],
    };
    const info = getHoverInfo(
      "relationship",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**relationship**");
    expect(info!.content).toContain(
      "Cardinality relationship between the cubes"
    );
    expect(info!.content).toContain("`one_to_one`");
    expect(info!.content).toContain("`one_to_many`");
    expect(info!.content).toContain("`many_to_one`");
    expect(info!.content).toContain("`belongsTo`");
    expect(info!.content).toContain("`hasMany`");
    expect(info!.content).toContain("`hasOne`");
  });
});

// ---------------------------------------------------------------------------
// 2. Hovering over `type` in a dimension
// ---------------------------------------------------------------------------

describe("property hover: type in dimension", () => {
  it("shows dimension type description and valid values", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "status",
      existingKeys: ["sql", "type"],
    };
    const info = getHoverInfo("type", ctx, "yaml", cubeJsSpec, emptyRegistry);

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**type**");
    expect(info!.content).toContain("Data type of this dimension");
    expect(info!.content).toContain("`string`");
    expect(info!.content).toContain("`number`");
    expect(info!.content).toContain("`boolean`");
    expect(info!.content).toContain("`time`");
    expect(info!.content).toContain("`geo`");
  });
});

// ---------------------------------------------------------------------------
// 3. Hovering over FILTER_PARAMS template variable
// ---------------------------------------------------------------------------

describe("template variable hover: FILTER_PARAMS", () => {
  it("shows usage syntax with callback pattern", () => {
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "status",
      isTemplateLiteral: true,
      prefix: "FILTER_PARAMS",
    };
    const info = getHoverInfo(
      "FILTER_PARAMS",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**FILTER_PARAMS**");
    expect(info!.content).toContain("filter");
    expect(info!.content).toContain("Usage:");
    expect(info!.content).toContain("CubeName");
    expect(info!.content).toContain("memberName");
  });
});

// ---------------------------------------------------------------------------
// 4. Hovering over SECURITY_CONTEXT
// ---------------------------------------------------------------------------

describe("template variable hover: SECURITY_CONTEXT", () => {
  it("shows usage with unsafeValue()", () => {
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: null,
      memberName: null,
      isTemplateLiteral: true,
      prefix: "SECURITY_CONTEXT",
    };
    const info = getHoverInfo(
      "SECURITY_CONTEXT",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**SECURITY_CONTEXT**");
    expect(info!.content).toContain("unsafeValue");
    expect(info!.content).toContain("security context");
  });
});

// ---------------------------------------------------------------------------
// 5. Hovering over SQL_UTILS
// ---------------------------------------------------------------------------

describe("template variable hover: SQL_UTILS", () => {
  it("shows available methods", () => {
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: null,
      memberName: null,
      isTemplateLiteral: true,
      prefix: "SQL_UTILS",
    };
    const info = getHoverInfo(
      "SQL_UTILS",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**SQL_UTILS**");
    expect(info!.content).toContain("convertTz");
    expect(info!.content).toContain("Methods:");
  });
});

// ---------------------------------------------------------------------------
// 6. Hovering over a cube name in join sql (from registry)
// ---------------------------------------------------------------------------

describe("cube reference hover", () => {
  it("shows cube dimensions and measures summary", () => {
    const ctx: CursorContext = {
      type: "sql",
      cubeName: "Orders",
      memberType: "joins",
      memberName: "users",
      isTemplateLiteral: true,
      prefix: "Orders",
    };
    const info = getHoverInfo(
      "Orders",
      ctx,
      "yaml",
      cubeJsSpec,
      populatedRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**Orders** (cube)");
    expect(info!.content).toContain("Dimensions:");
    expect(info!.content).toContain("id");
    expect(info!.content).toContain("status");
    expect(info!.content).toContain("created_at");
    expect(info!.content).toContain("Measures:");
    expect(info!.content).toContain("count");
    expect(info!.content).toContain("total_amount");
  });
});

// ---------------------------------------------------------------------------
// 7. Hovering over deprecated property `shown`
// ---------------------------------------------------------------------------

describe("deprecated property hover: shown", () => {
  it("shows deprecation notice with replacement", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "status",
      existingKeys: ["sql", "type", "shown"],
    };
    const info = getHoverInfo("shown", ctx, "yaml", cubeJsSpec, emptyRegistry);

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**shown**");
    expect(info!.content).toContain("Deprecated");
    expect(info!.content).toContain("`public`");
  });
});

// ---------------------------------------------------------------------------
// 8. Hovering over an unknown word
// ---------------------------------------------------------------------------

describe("unknown word hover", () => {
  it("returns null for unrecognized words", () => {
    const ctx: CursorContext = { type: "unknown" };
    const info = getHoverInfo(
      "xyzNotARealProperty",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).toBeNull();
  });

  it("returns null for empty string", () => {
    const ctx: CursorContext = { type: "unknown" };
    const info = getHoverInfo("", ctx, "yaml", cubeJsSpec, emptyRegistry);

    expect(info).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 9. Hovering over `type` in a measure (different from dimension types)
// ---------------------------------------------------------------------------

describe("property hover: type in measure", () => {
  it("shows measure types (different from dimension types)", () => {
    const ctx: CursorContext = {
      type: "member_body",
      cubeName: "Orders",
      memberType: "measures",
      memberName: "count",
      existingKeys: ["sql", "type"],
    };
    const info = getHoverInfo("type", ctx, "yaml", cubeJsSpec, emptyRegistry);

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**type**");
    expect(info!.content).toContain("Aggregation type");
    // Measure-specific types
    expect(info!.content).toContain("`count`");
    expect(info!.content).toContain("`sum`");
    expect(info!.content).toContain("`avg`");
    expect(info!.content).toContain("`min`");
    expect(info!.content).toContain("`max`");
    expect(info!.content).toContain("`countDistinct`");
    expect(info!.content).toContain("`runningTotal`");
    // Should NOT contain dimension-only types like 'geo'
    expect(info!.content).not.toContain("`geo`");
  });
});

// ---------------------------------------------------------------------------
// Additional edge cases
// ---------------------------------------------------------------------------

describe("cube_root property hover", () => {
  it("shows hover for cube-level properties", () => {
    const ctx: CursorContext = {
      type: "cube_root",
      cubeName: "Orders",
      constructType: "cube",
    };
    const info = getHoverInfo(
      "sql_table",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**sqlTable**");
    expect(info!.content).toContain("Table name for this cube");
  });
});

describe("template variables in non-sql context", () => {
  it("still resolves template variables regardless of context", () => {
    const ctx: CursorContext = { type: "unknown" };
    const info = getHoverInfo(
      "COMPILE_CONTEXT",
      ctx,
      "yaml",
      cubeJsSpec,
      emptyRegistry
    );

    expect(info).not.toBeNull();
    expect(info!.content).toContain("**COMPILE_CONTEXT**");
    expect(info!.content).toContain("compile-time context");
  });
});

describe("property_value context hover", () => {
  it("shows the property info when hovering in property value context", () => {
    const ctx: CursorContext = {
      type: "property_value",
      cubeName: "Orders",
      memberType: "dimensions",
      memberName: "status",
      propertyKey: "type",
    };
    const info = getHoverInfo("string", ctx, "yaml", cubeJsSpec, emptyRegistry);

    // In property_value context, we show the property's hover info
    expect(info).not.toBeNull();
    expect(info!.content).toContain("**type**");
    expect(info!.content).toContain("`string`");
  });
});
