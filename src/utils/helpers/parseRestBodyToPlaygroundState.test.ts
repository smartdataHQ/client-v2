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

  test("maps member filters and dateRange-only timeDimensions", () => {
    const state = parseRestBodyToPlaygroundState(
      JSON.stringify({
        query: {
          measures: [
            "semantic_events.count",
            "semantic_events.count_share_pct",
          ],
          dimensions: ["semantic_events.dimensions_website"],
          segments: ["semantic_events.document_analysed"],
          filters: [
            {
              member: "semantic_events.dimensions_website",
              operator: "set",
            },
          ],
          timeDimensions: [
            {
              dimension: "semantic_events.timestamp",
              dateRange: [
                "2026-07-01T00:00:00.000",
                "2026-07-01T23:59:59.999",
              ],
            },
          ],
          order: { "semantic_events.count": "desc" },
          timezone: "UTC",
          limit: 100,
          offset: 0,
        },
      })
    );

    expect(state.measures).toEqual([
      "semantic_events.count",
      "semantic_events.count_share_pct",
    ]);
    expect(state.dimensions).toEqual(["semantic_events.dimensions_website"]);
    expect(state.segments).toEqual(["semantic_events.document_analysed"]);
    expect(state.filters).toEqual([
      {
        dimension: "semantic_events.dimensions_website",
        operator: "set",
        values: [],
      },
      {
        dimension: "semantic_events.timestamp",
        operator: "inDateRange",
        values: ["2026-07-01T00:00:00.000", "2026-07-01T23:59:59.999"],
      },
    ]);
    expect(state.timeDimensions).toEqual([]);
    expect(state.order).toEqual([{ id: "semantic_events.count", desc: true }]);
    expect(state.limit).toBe(100);
    expect(state.offset).toBe(0);
  });

  test("keeps granularity and converts dateRange to a filter", () => {
    const state = parseRestBodyToPlaygroundState(
      JSON.stringify({
        measures: ["Orders.count"],
        timeDimensions: [
          {
            dimension: "Orders.createdAt",
            granularity: "day",
            dateRange: ["2026-07-01", "2026-07-31"],
          },
        ],
      })
    );

    expect(state.timeDimensions).toEqual([
      { dimension: "Orders.createdAt", granularity: "day" },
    ]);
    expect(state.filters).toEqual([
      {
        dimension: "Orders.createdAt",
        operator: "inDateRange",
        values: ["2026-07-01", "2026-07-31"],
      },
    ]);
  });

  test("flattens and-groups and keeps or-groups", () => {
    const state = parseRestBodyToPlaygroundState(
      JSON.stringify({
        filters: [
          {
            and: [
              { member: "Orders.status", operator: "equals", values: ["open"] },
              { dimension: "Orders.city", operator: "set" },
            ],
          },
          {
            or: [
              { member: "Orders.country", operator: "equals", values: ["IS"] },
            ],
          },
        ],
      })
    );

    expect(state.filters).toEqual([
      {
        dimension: "Orders.status",
        operator: "equals",
        values: ["open"],
      },
      {
        dimension: "Orders.city",
        operator: "set",
        values: [],
      },
      {
        or: [
          {
            dimension: "Orders.country",
            operator: "equals",
            values: ["IS"],
          },
        ],
      },
    ]);
  });
});
