/**
 * Cube Registry — wraps FetchMeta query results to provide a lookup API
 * for cube names and their members. Used by completion and hover providers
 * to suggest cross-cube references.
 */

import type { CubeRegistryEntry, MemberEntry, RegistryStatus } from "./types";

// ---------------------------------------------------------------------------
// FetchMeta response shape (from Hasura fetch_meta action)
// ---------------------------------------------------------------------------

export interface FetchMetaCube {
  name: string;
  title?: string;
  type?: string; // "cube" or "view"
  dimensions?: Array<{
    name: string;
    title?: string;
    type?: string;
    primaryKey?: boolean;
  }>;
  measures?: Array<{
    name: string;
    title?: string;
    type?: string;
  }>;
  segments?: Array<{
    name: string;
    title?: string;
  }>;
}

// ---------------------------------------------------------------------------
// CubeRegistry
// ---------------------------------------------------------------------------

export class CubeRegistry {
  private entries: CubeRegistryEntry[] = [];
  private entryMap: Map<string, CubeRegistryEntry> = new Map();
  private _status: RegistryStatus = "empty";

  get status(): RegistryStatus {
    return this._status;
  }

  /**
   * Populate the registry from a FetchMeta cubes array.
   * Converts each FetchMetaCube to a CubeRegistryEntry and builds the
   * lookup map for O(1) access by name.
   */
  populate(cubes: FetchMetaCube[]): void {
    const entries: CubeRegistryEntry[] = cubes.map((c) => ({
      name: c.name,
      title: c.title ?? c.name,
      type: (c.type === "view" ? "view" : "cube") as "cube" | "view",
      dimensions: (c.dimensions ?? []).map((d) => ({
        name: d.name,
        title: d.title ?? d.name,
        type: d.type ?? "string",
        ...(d.primaryKey ? { primaryKey: true } : {}),
      })),
      measures: (c.measures ?? []).map((m) => ({
        name: m.name,
        title: m.title ?? m.name,
        type: m.type ?? "number",
      })),
      segments: (c.segments ?? []).map((s) => ({
        name: s.name,
        title: s.title ?? s.name,
        type: "boolean",
      })),
    }));

    this.entries = entries;
    this.entryMap = new Map(entries.map((e) => [e.name, e]));
    this._status = "ready";
  }

  /** Transition to loading state. */
  startLoading(): void {
    this._status = "loading";
  }

  /** Transition to refreshing state (keeps existing data available). */
  startRefresh(): void {
    this._status = "refreshing";
  }

  /** Transition to error state (keeps existing data available). */
  setError(): void {
    this._status = "error";
  }

  /** Look up a cube by exact name. */
  getCube(name: string): CubeRegistryEntry | undefined {
    return this.entryMap.get(name);
  }

  /** Return all cube names in the registry. */
  getAllCubeNames(): string[] {
    return this.entries.map((e) => e.name);
  }

  /** Return members of a given type for a cube. Returns [] if cube not found. */
  getMembersByType(
    cubeName: string,
    memberType: "dimensions" | "measures" | "segments"
  ): MemberEntry[] {
    const cube = this.entryMap.get(cubeName);
    if (!cube) return [];
    return cube[memberType];
  }

  /** Return all registry entries. */
  getAllEntries(): CubeRegistryEntry[] {
    return this.entries;
  }
}
