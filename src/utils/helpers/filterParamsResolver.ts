import type { CubeMember } from "@/types/cube";

/**
 * Check if a dimension is a lookup key (FILTER_PARAMS parameter).
 * These are the "selector" dimensions like classification_type, location_type.
 */
export function isLookupKeyDimension(member: CubeMember): boolean {
  return member?.meta?.nested_lookup_key === true;
}

/**
 * Check if a dimension depends on a lookup key.
 * These are the "data" dimensions like classification_value, location_label.
 */
export function isResolvedDimension(member: CubeMember): boolean {
  return (
    typeof member?.meta?.resolved_by === "string" &&
    member.meta.resolved_by.length > 0
  );
}

/**
 * Get the known values for a lookup key dimension.
 */
export function getKnownValues(member: CubeMember): string[] {
  if (!isLookupKeyDimension(member)) return [];
  return Array.isArray(member.meta?.known_values)
    ? member.meta.known_values
    : [];
}

/**
 * Given a list of selected dimension names and a map of all available dimensions,
 * return the list of lookup key CubeMembers that are required as filter parameters.
 *
 * Scans selected dimensions for any with `meta.resolved_by`, then finds the
 * corresponding lookup key dimension in the same cube. Deduplicates automatically.
 *
 * @param selectedDimensionNames - Array of fully-qualified names (e.g. "semantic_events.classification_value")
 * @param availableDimensions - Map of all available dimensions keyed by name
 * @returns Array of unique lookup key CubeMembers that need filter values
 */
export function getRequiredFilterParams(
  selectedDimensionNames: string[],
  availableDimensions: Record<string, CubeMember>
): CubeMember[] {
  const requiredKeys = new Map<string, CubeMember>();

  for (const dimName of selectedDimensionNames) {
    const member = availableDimensions[dimName];
    if (!member || !isResolvedDimension(member)) continue;

    // resolved_by is the short name (e.g. "classification_type")
    // We need the fully-qualified name: "CubeName.classification_type"
    const [cubeName] = dimName.split(".");
    const lookupKeyName = `${cubeName}.${member.meta.resolved_by}`;
    const lookupMember = availableDimensions[lookupKeyName];

    if (lookupMember && !requiredKeys.has(lookupKeyName)) {
      requiredKeys.set(lookupKeyName, lookupMember);
    }
  }

  return Array.from(requiredKeys.values());
}

/**
 * Remove duplicate filter param entries by name.
 */
export function deduplicateFilterParams(params: CubeMember[]): CubeMember[] {
  const seen = new Set<string>();
  return params.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}
