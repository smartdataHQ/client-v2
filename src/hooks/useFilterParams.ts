import { useMemo, useRef } from "react";
import { getOr } from "unchanged";

import {
  getRequiredFilterParams,
  deduplicateFilterParams,
} from "@/utils/helpers/filterParamsResolver";
import type { CubeMember } from "@/types/cube";

interface Props {
  availableQueryMembers: Record<
    string,
    Record<string, Record<string, CubeMember>>
  >;
  playgroundState: Record<string, any>;
}

interface FilterParamsResult {
  /** All selector dimensions required by currently selected dimensions */
  requiredParams: CubeMember[];
}

/**
 * Watches the current playground state and available cube metadata to determine
 * which selector dimensions (FILTER_PARAMS lookup keys) are required based on
 * the selected dimensions.
 *
 * Uses a stable JSON key to prevent unnecessary re-renders when the computed
 * result hasn't actually changed.
 */
export default function useFilterParams({
  availableQueryMembers,
  playgroundState,
}: Props): FilterParamsResult {
  const prevKeyRef = useRef<string>("");
  const prevResultRef = useRef<FilterParamsResult>({ requiredParams: [] });

  return useMemo(() => {
    if (!availableQueryMembers || !playgroundState) {
      return { requiredParams: [] };
    }

    // Flatten all available dimensions across all cubes
    const allDimensions: Record<string, CubeMember> = {};
    for (const cubeName of Object.keys(availableQueryMembers)) {
      const cubeDims = getOr(
        {},
        "dimensions",
        availableQueryMembers[cubeName]
      ) as Record<string, CubeMember>;
      Object.assign(allDimensions, cubeDims);
    }

    // Get selected dimension names from playground state
    const selectedDims: string[] = getOr([], "dimensions", playgroundState);

    // Find required selectors
    const requiredParams = deduplicateFilterParams(
      getRequiredFilterParams(selectedDims, allDimensions)
    );

    // Stable reference check: only return new object if the result changed
    const key = JSON.stringify(requiredParams.map((p) => p.name));

    if (key === prevKeyRef.current) {
      return prevResultRef.current;
    }

    prevKeyRef.current = key;
    prevResultRef.current = { requiredParams };
    return prevResultRef.current;
  }, [availableQueryMembers, playgroundState]);
}
