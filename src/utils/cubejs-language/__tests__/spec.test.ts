/**
 * T004: TDD tests for the Cube.js schema spec.
 *
 * Validates the static spec exported from ../spec.ts against known
 * Cube.js v1.6.19 schema requirements.
 */
import { describe, it, expect } from "vitest";

import { cubeJsSpec, CUBEJS_SPEC_VERSION, getKeyForFormat } from "../spec";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cube = cubeJsSpec.constructs.cube;
const view = cubeJsSpec.constructs.view;

function memberType(name: string) {
  return cube.memberTypes[name];
}

// ---------------------------------------------------------------------------
// 1. Version constant
// ---------------------------------------------------------------------------

describe("CUBEJS_SPEC_VERSION", () => {
  it('equals "1.6.19"', () => {
    expect(CUBEJS_SPEC_VERSION).toBe("1.6.19");
  });

  it("matches the spec version", () => {
    expect(cubeJsSpec.version).toBe(CUBEJS_SPEC_VERSION);
  });
});

// ---------------------------------------------------------------------------
// 2. Cube construct
// ---------------------------------------------------------------------------

describe("cube construct", () => {
  it('exists with name "cube"', () => {
    expect(cube).toBeDefined();
    expect(cube.name).toBe("cube");
  });

  it("has all required top-level properties", () => {
    const keys = Object.keys(cube.properties);
    const expected = [
      "name",
      "sql",
      "sqlTable",
      "title",
      "sqlAlias",
      "dataSource",
      "description",
      "extends",
      "refreshKey",
      "rewriteQueries",
      "shown",
      "public",
      "meta",
      "fileName",
      "joins",
      "measures",
      "dimensions",
      "segments",
      "preAggregations",
      "accessPolicy",
      "hierarchies",
    ];
    for (const k of expected) {
      expect(keys).toContain(k);
    }
  });

  it("has all member type sections", () => {
    const sections = Object.keys(cube.memberTypes);
    expect(sections).toEqual(
      expect.arrayContaining([
        "dimensions",
        "measures",
        "joins",
        "segments",
        "preAggregations",
        "hierarchies",
      ])
    );
  });
});

// ---------------------------------------------------------------------------
// 3. View construct
// ---------------------------------------------------------------------------

describe("view construct", () => {
  it('exists with name "view"', () => {
    expect(view).toBeDefined();
    expect(view.name).toBe("view");
  });

  it("has view-specific properties: cubes, folders, isView", () => {
    expect(view.properties.cubes).toBeDefined();
    expect(view.properties.folders).toBeDefined();
    expect(view.properties.isView).toBeDefined();
  });

  it("cubes property has children with view cube item keys", () => {
    const children = view.properties.cubes.children;
    expect(children).toBeDefined();
    const childKeys = Object.keys(children!);
    expect(childKeys).toEqual(
      expect.arrayContaining([
        "joinPath",
        "prefix",
        "split",
        "alias",
        "includes",
        "excludes",
      ])
    );
  });
});

// ---------------------------------------------------------------------------
// 4. Dimension types
// ---------------------------------------------------------------------------

describe("dimension types", () => {
  const dimSpec = memberType("dimensions");

  it("has all 5 dimension types", () => {
    expect(dimSpec.typeValues).toEqual(
      expect.arrayContaining(["string", "number", "boolean", "time", "geo"])
    );
    expect(dimSpec.typeValues).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// 5. Measure types
// ---------------------------------------------------------------------------

describe("measure types", () => {
  const measSpec = memberType("measures");

  it("includes base measure types", () => {
    const base = [
      "count",
      "sum",
      "avg",
      "min",
      "max",
      "number",
      "countDistinct",
      "countDistinctApprox",
      "runningTotal",
      "string",
      "boolean",
      "time",
    ];
    for (const t of base) {
      expect(measSpec.typeValues).toContain(t);
    }
  });

  it("includes multi-stage types: numberAgg, rank", () => {
    expect(measSpec.typeValues).toContain("numberAgg");
    expect(measSpec.typeValues).toContain("rank");
  });
});

// ---------------------------------------------------------------------------
// 6. Join relationships
// ---------------------------------------------------------------------------

describe("join relationships", () => {
  const joinSpec = memberType("joins");

  it("has all 12 relationship values", () => {
    const expected = [
      "many_to_one",
      "manyToOne",
      "belongs_to",
      "belongsTo",
      "one_to_many",
      "oneToMany",
      "has_many",
      "hasMany",
      "one_to_one",
      "oneToOne",
      "has_one",
      "hasOne",
    ];
    expect(joinSpec.typeValues).toEqual(expect.arrayContaining(expected));
    expect(joinSpec.typeValues).toHaveLength(12);
  });
});

// ---------------------------------------------------------------------------
// 7. Pre-aggregation types
// ---------------------------------------------------------------------------

describe("pre-aggregation types", () => {
  const paSpec = memberType("preAggregations");

  it("includes all 5 types", () => {
    const expected = [
      "rollup",
      "originalSql",
      "rollupJoin",
      "rollupLambda",
      "autoRollup",
    ];
    expect(paSpec.typeValues).toEqual(expect.arrayContaining(expected));
    expect(paSpec.typeValues).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// 8. Refresh key properties
// ---------------------------------------------------------------------------

describe("refresh key properties", () => {
  it("cube refreshKey has sql, every, timezone, immutable", () => {
    const refreshKey = cube.properties.refreshKey;
    expect(refreshKey).toBeDefined();
    const children = refreshKey.children!;
    expect(Object.keys(children)).toEqual(
      expect.arrayContaining(["sql", "every", "timezone", "immutable"])
    );
  });

  it("pre-aggregation refreshKey has incremental and updateWindow", () => {
    const paProps = memberType("preAggregations").properties;
    const refreshKey = paProps.refreshKey;
    expect(refreshKey).toBeDefined();
    const children = refreshKey.children!;
    expect(Object.keys(children)).toEqual(
      expect.arrayContaining([
        "sql",
        "every",
        "timezone",
        "incremental",
        "updateWindow",
      ])
    );
  });
});

// ---------------------------------------------------------------------------
// 9. View cubes item properties
// ---------------------------------------------------------------------------

describe("view cubes item properties", () => {
  it("has joinPath, prefix, split, alias, includes, excludes", () => {
    const children = view.properties.cubes.children!;
    const keys = Object.keys(children);
    expect(keys).toEqual(
      expect.arrayContaining([
        "joinPath",
        "prefix",
        "split",
        "alias",
        "includes",
        "excludes",
      ])
    );
  });

  it("joinPath is required", () => {
    const children = view.properties.cubes.children!;
    expect(children.joinPath.required).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 10. YAML <-> JS key mappings
// ---------------------------------------------------------------------------

describe("getKeyForFormat", () => {
  it("returns yamlKey for yaml format", () => {
    const sqlTableProp = cube.properties.sqlTable;
    expect(getKeyForFormat(sqlTableProp, "yaml")).toBe("sql_table");
  });

  it("returns jsKey for js format", () => {
    const sqlTableProp = cube.properties.sqlTable;
    expect(getKeyForFormat(sqlTableProp, "js")).toBe("sqlTable");
  });

  it("refreshKey maps to refresh_key for yaml", () => {
    const refreshKeyProp = cube.properties.refreshKey;
    expect(getKeyForFormat(refreshKeyProp, "yaml")).toBe("refresh_key");
  });

  it("refreshKey maps to refreshKey for js", () => {
    const refreshKeyProp = cube.properties.refreshKey;
    expect(getKeyForFormat(refreshKeyProp, "js")).toBe("refreshKey");
  });

  it("preAggregations maps to pre_aggregations for yaml", () => {
    const paProp = cube.properties.preAggregations;
    expect(getKeyForFormat(paProp, "yaml")).toBe("pre_aggregations");
  });

  it("simple keys are identical in both formats", () => {
    const nameProp = cube.properties.name;
    expect(getKeyForFormat(nameProp, "yaml")).toBe("name");
    expect(getKeyForFormat(nameProp, "js")).toBe("name");
  });
});

// ---------------------------------------------------------------------------
// 11. Template variables
// ---------------------------------------------------------------------------

describe("template variables", () => {
  it("has all 5 template variables", () => {
    const names = cubeJsSpec.templateVariables.map((v) => v.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "CUBE",
        "FILTER_PARAMS",
        "SECURITY_CONTEXT",
        "SQL_UTILS",
        "COMPILE_CONTEXT",
      ])
    );
    expect(names).toHaveLength(5);
  });

  it("FILTER_PARAMS has filter method", () => {
    const fp = cubeJsSpec.templateVariables.find(
      (v) => v.name === "FILTER_PARAMS"
    )!;
    expect(fp.methods).toContain("filter");
  });

  it("SECURITY_CONTEXT has unsafeValue method", () => {
    const sc = cubeJsSpec.templateVariables.find(
      (v) => v.name === "SECURITY_CONTEXT"
    )!;
    expect(sc.methods).toContain("unsafeValue");
  });

  it("SQL_UTILS has convertTz method", () => {
    const su = cubeJsSpec.templateVariables.find(
      (v) => v.name === "SQL_UTILS"
    )!;
    expect(su.methods).toContain("convertTz");
  });
});

// ---------------------------------------------------------------------------
// 12. Deprecated properties
// ---------------------------------------------------------------------------

describe("deprecated properties", () => {
  it('dimension "shown" is deprecated', () => {
    const dimProps = memberType("dimensions").properties;
    expect(dimProps.shown.deprecated).toBe(true);
  });

  it('measure "shown" is deprecated', () => {
    const measProps = memberType("measures").properties;
    expect(measProps.shown.deprecated).toBe(true);
  });

  it('measure "visible" is deprecated', () => {
    const measProps = memberType("measures").properties;
    expect(measProps.visible.deprecated).toBe(true);
  });

  it("refreshRangeStart is deprecated", () => {
    const paProps = memberType("preAggregations").properties;
    expect(paProps.refreshRangeStart.deprecated).toBe(true);
  });

  it("refreshRangeEnd is deprecated", () => {
    const paProps = memberType("preAggregations").properties;
    expect(paProps.refreshRangeEnd.deprecated).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 13. Required properties
// ---------------------------------------------------------------------------

describe("required properties", () => {
  it("dimension type is required", () => {
    const dimProps = memberType("dimensions").properties;
    expect(dimProps.type.required).toBe(true);
  });

  it("measure type is required", () => {
    const measProps = memberType("measures").properties;
    expect(measProps.type.required).toBe(true);
  });

  it("join sql is required", () => {
    const joinProps = memberType("joins").properties;
    expect(joinProps.sql.required).toBe(true);
  });

  it("join relationship is required", () => {
    const joinProps = memberType("joins").properties;
    expect(joinProps.relationship.required).toBe(true);
  });

  it("segment sql is required", () => {
    const segProps = memberType("segments").properties;
    expect(segProps.sql.required).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 14. Access policy
// ---------------------------------------------------------------------------

describe("access policy", () => {
  const apChildren = cube.properties.accessPolicy.children!;

  it("has role, memberLevel, rowLevel, conditions", () => {
    const keys = Object.keys(apChildren);
    expect(keys).toEqual(
      expect.arrayContaining(["role", "memberLevel", "rowLevel", "conditions"])
    );
  });

  it("role is required", () => {
    expect(apChildren.role.required).toBe(true);
  });

  it("memberLevel has includes/excludes children", () => {
    const mlChildren = apChildren.memberLevel.children!;
    expect(Object.keys(mlChildren)).toEqual(
      expect.arrayContaining(["includes", "excludes"])
    );
  });

  it("rowLevel has filters and allowAll children", () => {
    const rlChildren = apChildren.rowLevel.children!;
    expect(Object.keys(rlChildren)).toEqual(
      expect.arrayContaining(["filters", "allowAll"])
    );
  });

  it("conditions has if child", () => {
    const condChildren = apChildren.conditions.children!;
    expect(condChildren.if).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 15. Hierarchies
// ---------------------------------------------------------------------------

describe("hierarchies", () => {
  const hierSpec = memberType("hierarchies");

  it("has title, public, levels properties", () => {
    const keys = Object.keys(hierSpec.properties);
    expect(keys).toEqual(expect.arrayContaining(["title", "public", "levels"]));
  });

  it("levels is required", () => {
    expect(hierSpec.properties.levels.required).toBe(true);
  });
});
