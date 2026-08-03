import { initialState } from "@/hooks/useAnalyticsQuery";
import type { PlaygroundState } from "@/types/exploration";
import type { SortBy } from "@/types/sort";

const QUERY_KEYS = [
  "measures",
  "dimensions",
  "filters",
  "timeDimensions",
  "segments",
  "order",
  "timezone",
  "limit",
  "offset",
  "page",
] as const;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const normalizeOrder = (order: unknown): SortBy[] => {
  if (Array.isArray(order)) {
    return order
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        if (typeof row.id === "string") {
          return {
            id: row.id,
            desc: Boolean(row.desc),
          };
        }
        return null;
      })
      .filter(Boolean) as SortBy[];
  }

  if (isPlainObject(order)) {
    return Object.entries(order).map(([id, direction]) => ({
      id,
      desc: direction === "desc",
    }));
  }

  return [];
};

const extractQuery = (parsed: unknown): Record<string, unknown> => {
  if (!isPlainObject(parsed)) {
    throw new Error("Body must be a JSON object");
  }

  if (isPlainObject(parsed.query)) {
    return parsed.query;
  }

  const hasQueryField = QUERY_KEYS.some((key) => key in parsed);
  if (hasQueryField) {
    return parsed;
  }

  throw new Error(
    'Body must include a Cube.js query object (or { "query": { ... } })'
  );
};

/**
 * Parse a Cube.js REST /v1/load body (or a bare query) into Explore playground state.
 */
export const parseRestBodyToPlaygroundState = (
  body: string
): PlaygroundState => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error("Invalid JSON");
  }

  const query = extractQuery(parsed);
  const next: PlaygroundState = {
    ...initialState,
    measures: Array.isArray(query.measures) ? query.measures : [],
    dimensions: Array.isArray(query.dimensions) ? query.dimensions : [],
    filters: Array.isArray(query.filters) ? (query.filters as any) : [],
    timeDimensions: Array.isArray(query.timeDimensions)
      ? (query.timeDimensions as PlaygroundState["timeDimensions"])
      : [],
    segments: Array.isArray(query.segments) ? (query.segments as any) : [],
    order: normalizeOrder(query.order),
    timezone:
      typeof query.timezone === "string"
        ? query.timezone
        : initialState.timezone,
    limit:
      typeof query.limit === "number" && Number.isFinite(query.limit)
        ? query.limit
        : initialState.limit,
    offset:
      typeof query.offset === "number" && Number.isFinite(query.offset)
        ? query.offset
        : initialState.offset,
  };

  if (typeof query.page === "number" && Number.isFinite(query.page)) {
    next.page = query.page;
  }

  return next;
};
