import { describe, test, expect } from "vitest";

import { parseRestBodyToPlaygroundState } from "./parseRestBodyToPlaygroundState";

describe("parseRestBodyToPlaygroundState", () => {
  test("parses wrapped query body", () => {
    const state = parseRestBodyToPlaygroundState(
      JSON.stringify({
        query: {
          measures: ["Celestial.count"],
          dimensions: ["Celestial.geohash"],
          filters: [
            {
              dimension: "Celestial.geohash",
              operator: "set",
              values: [],
            },
          ],
          timeDimensions: [{ dimension: "Celestial.date", granularity: "day" }],
          order: { "Celestial.count": "desc" },
          limit: 100,
          offset: 10,
          timezone: "UTC",
        },
        format: "csv",
      })
    );

    expect(state.measures).toEqual(["Celestial.count"]);
    expect(state.dimensions).toEqual(["Celestial.geohash"]);
    expect(state.filters).toHaveLength(1);
    expect(state.timeDimensions).toEqual([
      { dimension: "Celestial.date", granularity: "day" },
    ]);
    expect(state.order).toEqual([{ id: "Celestial.count", desc: true }]);
    expect(state.limit).toBe(100);
    expect(state.offset).toBe(10);
  });

  test("parses bare query object", () => {
    const state = parseRestBodyToPlaygroundState(
      JSON.stringify({
        measures: ["Orders.count"],
        dimensions: ["Orders.status"],
      })
    );

    expect(state.measures).toEqual(["Orders.count"]);
    expect(state.dimensions).toEqual(["Orders.status"]);
    expect(state.order).toEqual([]);
  });

  test("throws on invalid json", () => {
    expect(() => parseRestBodyToPlaygroundState("{")).toThrow("Invalid JSON");
  });
});
