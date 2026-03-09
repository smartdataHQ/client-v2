import { describe, it, expect } from "vitest";

import type { CubeMember } from "@/types/cube";

import {
  isLookupKeyDimension,
  isResolvedDimension,
  getKnownValues,
  getRequiredFilterParams,
  deduplicateFilterParams,
} from "../filterParamsResolver";

function makeMember(overrides: Partial<CubeMember> = {}): CubeMember {
  return {
    name: "semantic_events.event",
    title: "Semantic Events Event",
    shortTitle: "Event",
    isVisible: true,
    type: "string",
    ...overrides,
  };
}

describe("filterParamsResolver", () => {
  describe("isLookupKeyDimension", () => {
    it("returns true for dimensions with nested_lookup_key meta", () => {
      const member = makeMember({
        name: "semantic_events.classification_type",
        meta: { nested_lookup_key: true, known_values: ["Category", "Tag"] },
      });
      expect(isLookupKeyDimension(member)).toBe(true);
    });

    it("returns false for normal dimensions", () => {
      const member = makeMember({ meta: { auto_generated: true } });
      expect(isLookupKeyDimension(member)).toBe(false);
    });

    it("returns false when meta is undefined", () => {
      const member = makeMember({ meta: undefined });
      expect(isLookupKeyDimension(member)).toBe(false);
    });
  });

  describe("isResolvedDimension", () => {
    it("returns true for dimensions with resolved_by meta", () => {
      const member = makeMember({
        name: "semantic_events.classification_value",
        meta: { resolved_by: "classification_type" },
      });
      expect(isResolvedDimension(member)).toBe(true);
    });

    it("returns false for normal dimensions", () => {
      const member = makeMember({ meta: {} });
      expect(isResolvedDimension(member)).toBe(false);
    });
  });

  describe("getKnownValues", () => {
    it("returns known_values array for lookup key dimensions", () => {
      const member = makeMember({
        meta: { nested_lookup_key: true, known_values: ["Category", "Tag"] },
      });
      expect(getKnownValues(member)).toEqual(["Category", "Tag"]);
    });

    it("returns empty array for non-lookup dimensions", () => {
      const member = makeMember({ meta: {} });
      expect(getKnownValues(member)).toEqual([]);
    });

    it("returns empty array when known_values is missing", () => {
      const member = makeMember({ meta: { nested_lookup_key: true } });
      expect(getKnownValues(member)).toEqual([]);
    });
  });

  describe("getRequiredFilterParams", () => {
    it("returns empty array when no selected dimensions need params", () => {
      const selected = ["semantic_events.event", "semantic_events.type"];
      const available: Record<string, CubeMember> = {
        "semantic_events.event": makeMember({ name: "semantic_events.event" }),
        "semantic_events.type": makeMember({ name: "semantic_events.type" }),
      };
      expect(getRequiredFilterParams(selected, available)).toEqual([]);
    });

    it("returns lookup key when a resolved dimension is selected", () => {
      const selected = ["semantic_events.classification_value"];
      const available: Record<string, CubeMember> = {
        "semantic_events.classification_type": makeMember({
          name: "semantic_events.classification_type",
          meta: { nested_lookup_key: true, known_values: ["Category", "Tag"] },
        }),
        "semantic_events.classification_value": makeMember({
          name: "semantic_events.classification_value",
          meta: { resolved_by: "classification_type" },
        }),
      };
      const result = getRequiredFilterParams(selected, available);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("semantic_events.classification_type");
      expect(result[0].meta.known_values).toEqual(["Category", "Tag"]);
    });

    it("returns lookup key only once even when multiple resolved dims share it", () => {
      const selected = [
        "semantic_events.classification_value",
        "semantic_events.classification_reasoning",
      ];
      const available: Record<string, CubeMember> = {
        "semantic_events.classification_type": makeMember({
          name: "semantic_events.classification_type",
          meta: { nested_lookup_key: true, known_values: ["Category", "Tag"] },
        }),
        "semantic_events.classification_value": makeMember({
          name: "semantic_events.classification_value",
          meta: { resolved_by: "classification_type" },
        }),
        "semantic_events.classification_reasoning": makeMember({
          name: "semantic_events.classification_reasoning",
          meta: { resolved_by: "classification_type" },
        }),
      };
      const result = getRequiredFilterParams(selected, available);
      expect(result).toHaveLength(1);
    });

    it("returns multiple lookup keys when dims from different groups are selected", () => {
      const selected = [
        "semantic_events.classification_value",
        "semantic_events.location_label",
      ];
      const available: Record<string, CubeMember> = {
        "semantic_events.classification_type": makeMember({
          name: "semantic_events.classification_type",
          meta: { nested_lookup_key: true, known_values: ["Category", "Tag"] },
        }),
        "semantic_events.classification_value": makeMember({
          name: "semantic_events.classification_value",
          meta: { resolved_by: "classification_type" },
        }),
        "semantic_events.location_type": makeMember({
          name: "semantic_events.location_type",
          meta: {
            nested_lookup_key: true,
            known_values: ["Vehicle", "Origin"],
          },
        }),
        "semantic_events.location_label": makeMember({
          name: "semantic_events.location_label",
          meta: { resolved_by: "location_type" },
        }),
      };
      const result = getRequiredFilterParams(selected, available);
      expect(result).toHaveLength(2);
      const names = result.map((r) => r.name);
      expect(names).toContain("semantic_events.classification_type");
      expect(names).toContain("semantic_events.location_type");
    });

    it("still returns lookup key when it is already in the selected list", () => {
      const selected = [
        "semantic_events.classification_type",
        "semantic_events.classification_value",
      ];
      const available: Record<string, CubeMember> = {
        "semantic_events.classification_type": makeMember({
          name: "semantic_events.classification_type",
          meta: { nested_lookup_key: true, known_values: ["Category", "Tag"] },
        }),
        "semantic_events.classification_value": makeMember({
          name: "semantic_events.classification_value",
          meta: { resolved_by: "classification_type" },
        }),
      };
      const result = getRequiredFilterParams(selected, available);
      expect(result).toHaveLength(1);
    });
  });

  describe("deduplicateFilterParams", () => {
    it("removes duplicate filter param entries by name", () => {
      const params = [
        makeMember({ name: "semantic_events.classification_type" }),
        makeMember({ name: "semantic_events.classification_type" }),
        makeMember({ name: "semantic_events.location_type" }),
      ];
      const result = deduplicateFilterParams(params);
      expect(result).toHaveLength(2);
    });

    it("returns empty array for empty input", () => {
      expect(deduplicateFilterParams([])).toEqual([]);
    });
  });
});
