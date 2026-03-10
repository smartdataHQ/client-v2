import { describe, it, expect } from "vitest";

import { CubeRegistry, type FetchMetaCube } from "../registry";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const sampleCubes: FetchMetaCube[] = [
  {
    name: "Orders",
    title: "Orders Cube",
    type: "cube",
    dimensions: [
      { name: "id", title: "ID", type: "number", primaryKey: true },
      { name: "status", title: "Status", type: "string" },
    ],
    measures: [
      { name: "count", title: "Count", type: "count" },
      { name: "totalAmount", title: "Total Amount", type: "sum" },
    ],
    segments: [{ name: "completed", title: "Completed" }],
  },
  {
    name: "Users",
    title: "Users Cube",
    type: "cube",
    dimensions: [
      { name: "id", title: "ID", type: "number", primaryKey: true },
      { name: "name", title: "Name", type: "string" },
      { name: "email", title: "Email", type: "string" },
    ],
    measures: [{ name: "count", title: "Count", type: "count" }],
    segments: [],
  },
  {
    name: "OrdersView",
    title: "Orders View",
    type: "view",
    dimensions: [{ name: "status", title: "Status", type: "string" }],
    measures: [{ name: "count", title: "Count", type: "count" }],
    segments: [],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CubeRegistry", () => {
  // 1. Initial state
  it("has status 'empty' with no cubes initially", () => {
    const reg = new CubeRegistry();
    expect(reg.status).toBe("empty");
    expect(reg.getAllCubeNames()).toEqual([]);
    expect(reg.getAllEntries()).toEqual([]);
  });

  // 2. Populate from FetchMeta
  it("populates correct CubeRegistryEntry[] from FetchMeta response", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);

    const entries = reg.getAllEntries();
    expect(entries).toHaveLength(3);

    const orders = entries.find((e) => e.name === "Orders")!;
    expect(orders.title).toBe("Orders Cube");
    expect(orders.type).toBe("cube");
    expect(orders.dimensions).toHaveLength(2);
    expect(orders.measures).toHaveLength(2);
    expect(orders.segments).toHaveLength(1);

    // Check primaryKey is carried through
    expect(orders.dimensions[0].primaryKey).toBe(true);
    expect(orders.dimensions[1].primaryKey).toBeUndefined();

    // Check segment type is always "boolean"
    expect(orders.segments[0].type).toBe("boolean");

    // Check view type
    const view = entries.find((e) => e.name === "OrdersView")!;
    expect(view.type).toBe("view");
  });

  // 3. getCube returns correct entry
  it("getCube(name) returns the correct entry", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);

    const users = reg.getCube("Users");
    expect(users).toBeDefined();
    expect(users!.name).toBe("Users");
    expect(users!.dimensions).toHaveLength(3);
  });

  // 4. getCube returns undefined for nonexistent
  it("getCube(nonexistent) returns undefined", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);
    expect(reg.getCube("DoesNotExist")).toBeUndefined();
  });

  // 5. getAllCubeNames
  it("getAllCubeNames() returns all cube names", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);
    expect(reg.getAllCubeNames()).toEqual(["Orders", "Users", "OrdersView"]);
  });

  // 6. getMembersByType — dimensions
  it("getMembersByType returns correct dimensions", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);

    const dims = reg.getMembersByType("Orders", "dimensions");
    expect(dims).toHaveLength(2);
    expect(dims[0].name).toBe("id");
    expect(dims[1].name).toBe("status");
  });

  // 7. getMembersByType — measures
  it("getMembersByType returns correct measures", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);

    const measures = reg.getMembersByType("Orders", "measures");
    expect(measures).toHaveLength(2);
    expect(measures[0].name).toBe("count");
    expect(measures[1].type).toBe("sum");
  });

  // 8. getMembersByType — segments
  it("getMembersByType returns correct segments", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);

    const segs = reg.getMembersByType("Orders", "segments");
    expect(segs).toHaveLength(1);
    expect(segs[0].name).toBe("completed");
    expect(segs[0].type).toBe("boolean");
  });

  // getMembersByType — nonexistent cube returns []
  it("getMembersByType returns [] for nonexistent cube", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);
    expect(reg.getMembersByType("Nope", "dimensions")).toEqual([]);
  });

  // 9. Status transitions: empty → loading → ready
  it("transitions empty → loading → ready", () => {
    const reg = new CubeRegistry();
    expect(reg.status).toBe("empty");

    reg.startLoading();
    expect(reg.status).toBe("loading");

    reg.populate(sampleCubes);
    expect(reg.status).toBe("ready");
  });

  // 10. Refresh: ready → refreshing → ready (with updated data)
  it("transitions ready → refreshing → ready with updated data", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);
    expect(reg.status).toBe("ready");
    expect(reg.getAllCubeNames()).toHaveLength(3);

    reg.startRefresh();
    expect(reg.status).toBe("refreshing");
    // Data still available during refresh
    expect(reg.getAllCubeNames()).toHaveLength(3);

    const updatedCubes: FetchMetaCube[] = [
      {
        name: "Products",
        title: "Products",
        type: "cube",
        dimensions: [{ name: "id", type: "number" }],
        measures: [],
        segments: [],
      },
    ];
    reg.populate(updatedCubes);
    expect(reg.status).toBe("ready");
    expect(reg.getAllCubeNames()).toEqual(["Products"]);
    expect(reg.getCube("Orders")).toBeUndefined();
  });

  // 11. Error state: loading → error
  it("transitions loading → error", () => {
    const reg = new CubeRegistry();
    reg.startLoading();
    expect(reg.status).toBe("loading");

    reg.setError();
    expect(reg.status).toBe("error");
  });

  // 12. After error, autocomplete still works for previously loaded cubes
  it("retains data after error for graceful degradation", () => {
    const reg = new CubeRegistry();
    reg.populate(sampleCubes);
    expect(reg.status).toBe("ready");

    // Simulate a refresh that fails
    reg.startRefresh();
    reg.setError();
    expect(reg.status).toBe("error");

    // Data from the last successful populate is still available
    expect(reg.getAllCubeNames()).toHaveLength(3);
    expect(reg.getCube("Orders")).toBeDefined();
    expect(reg.getMembersByType("Users", "dimensions")).toHaveLength(3);
  });

  // 13. Empty FetchMeta response → ready with empty registry
  it("handles empty FetchMeta response", () => {
    const reg = new CubeRegistry();
    reg.startLoading();
    reg.populate([]);

    expect(reg.status).toBe("ready");
    expect(reg.getAllCubeNames()).toEqual([]);
    expect(reg.getAllEntries()).toEqual([]);
  });

  // Defaults: missing title/type fields get sensible defaults
  it("applies defaults for missing title and type fields", () => {
    const reg = new CubeRegistry();
    reg.populate([
      {
        name: "Bare",
        // no title, no type, no dimensions/measures/segments
      },
    ]);

    const entry = reg.getCube("Bare")!;
    expect(entry.title).toBe("Bare"); // defaults to name
    expect(entry.type).toBe("cube"); // defaults to cube
    expect(entry.dimensions).toEqual([]);
    expect(entry.measures).toEqual([]);
    expect(entry.segments).toEqual([]);
  });
});
