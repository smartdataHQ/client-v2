import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import type { CubeMember } from "@/types/cube";

import useFilterParams from "../useFilterParams";

function makeMember(overrides: Partial<CubeMember> = {}): CubeMember {
  return {
    name: "test.field",
    title: "Test Field",
    shortTitle: "Field",
    isVisible: true,
    type: "string",
    ...overrides,
  };
}

const emptyPlayground = {
  dimensions: [] as string[],
  measures: [] as string[],
  filters: [] as any[],
  timeDimensions: [] as any[],
  segments: [] as string[],
  order: [] as any[],
  timezone: "UTC",
  limit: 100,
  offset: 0,
};

describe("useFilterParams", () => {
  it("returns empty requiredParams when no dimensions need selectors", () => {
    const availableQueryMembers = {
      semantic_events: {
        dimensions: {
          "semantic_events.event": makeMember({
            name: "semantic_events.event",
          }),
        },
        measures: {},
        segments: {},
        timeDimensions: {},
      },
    };

    const { result } = renderHook(() =>
      useFilterParams({
        availableQueryMembers,
        playgroundState: {
          ...emptyPlayground,
          dimensions: ["semantic_events.event"],
        },
      })
    );

    expect(result.current.requiredParams).toEqual([]);
  });

  it("returns required selectors when resolved dimensions are selected", () => {
    const availableQueryMembers = {
      semantic_events: {
        dimensions: {
          "semantic_events.classification_type": makeMember({
            name: "semantic_events.classification_type",
            meta: {
              nested_lookup_key: true,
              known_values: ["Category", "Tag"],
            },
          }),
          "semantic_events.classification_value": makeMember({
            name: "semantic_events.classification_value",
            meta: { resolved_by: "classification_type" },
          }),
        },
        measures: {},
        segments: {},
        timeDimensions: {},
      },
    };

    const { result } = renderHook(() =>
      useFilterParams({
        availableQueryMembers,
        playgroundState: {
          ...emptyPlayground,
          dimensions: ["semantic_events.classification_value"],
        },
      })
    );

    expect(result.current.requiredParams).toHaveLength(1);
    expect(result.current.requiredParams[0].name).toBe(
      "semantic_events.classification_type"
    );
  });

  it("handles empty playground state", () => {
    const { result } = renderHook(() =>
      useFilterParams({
        availableQueryMembers: {},
        playgroundState: emptyPlayground,
      })
    );

    expect(result.current.requiredParams).toEqual([]);
  });

  it("handles cubes with no selector dimensions", () => {
    const availableQueryMembers = {
      orders: {
        dimensions: {
          "orders.id": makeMember({ name: "orders.id", meta: {} }),
          "orders.status": makeMember({ name: "orders.status", meta: {} }),
        },
        measures: {},
        segments: {},
        timeDimensions: {},
      },
    };

    const { result } = renderHook(() =>
      useFilterParams({
        availableQueryMembers,
        playgroundState: {
          ...emptyPlayground,
          dimensions: ["orders.id", "orders.status"],
        },
      })
    );

    expect(result.current.requiredParams).toEqual([]);
  });

  it("handles multiple cubes with mixed selector and normal dimensions", () => {
    const availableQueryMembers = {
      orders: {
        dimensions: {
          "orders.id": makeMember({ name: "orders.id" }),
        },
        measures: {},
        segments: {},
        timeDimensions: {},
      },
      semantic_events: {
        dimensions: {
          "semantic_events.classification_type": makeMember({
            name: "semantic_events.classification_type",
            meta: { nested_lookup_key: true, known_values: ["Category"] },
          }),
          "semantic_events.classification_value": makeMember({
            name: "semantic_events.classification_value",
            meta: { resolved_by: "classification_type" },
          }),
        },
        measures: {},
        segments: {},
        timeDimensions: {},
      },
    };

    const { result } = renderHook(() =>
      useFilterParams({
        availableQueryMembers,
        playgroundState: {
          ...emptyPlayground,
          dimensions: ["orders.id", "semantic_events.classification_value"],
        },
      })
    );

    expect(result.current.requiredParams).toHaveLength(1);
    expect(result.current.requiredParams[0].name).toBe(
      "semantic_events.classification_type"
    );
  });
});
