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

const UNARY_FILTER_OPERATORS = new Set(["set", "notSet"]);

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

const filterMemberName = (filter: Record<string, unknown>): string | undefined => {
  if (typeof filter.dimension === "string") return filter.dimension;
  if (typeof filter.member === "string") return filter.member;
  return undefined;
};

const normalizeFilterValues = (
  operator: string,
  values: unknown
): unknown[] => {
  if (Array.isArray(values)) return values;
  if (UNARY_FILTER_OPERATORS.has(operator)) return [];
  if (values == null) return [];
  return [values];
};

const flattenFilters = (filters: unknown[]): Record<string, unknown>[] => {
  const out: Record<string, unknown>[] = [];

  for (const filter of filters) {
    if (!isPlainObject(filter)) continue;

    if (Array.isArray(filter.and)) {
      out.push(...flattenFilters(filter.and));
      continue;
    }

    // Keep OR groups intact so Cube.js still ORs them at runtime.
    if (Array.isArray(filter.or)) {
      const children = flattenFilters(filter.or);
      if (children.length > 0) {
        out.push({ or: children });
      }
      continue;
    }

    const member = filterMemberName(filter);
    if (!member || typeof filter.operator !== "string") continue;

    out.push({
      dimension: member,
      operator: filter.operator,
      values: normalizeFilterValues(filter.operator, filter.values),
    });
  }

  return out;
};

const normalizeTimeDimensions = (
  timeDimensions: unknown[],
  filters: Record<string, unknown>[]
): { dimension: string; granularity?: string; dateRange?: unknown }[] => {
  const next: { dimension: string; granularity?: string; dateRange?: unknown }[] =
    [];

  for (const td of timeDimensions) {
    if (!isPlainObject(td) || typeof td.dimension !== "string") continue;

    const granularity =
      typeof td.granularity === "string" ? td.granularity : undefined;
    const dateRange = td.dateRange;

    if (Array.isArray(dateRange) && dateRange.length > 0) {
      filters.push({
        dimension: td.dimension,
        operator: "inDateRange",
        values: dateRange.map((value) => String(value)),
      });
    }

    if (granularity) {
      const item: {
        dimension: string;
        granularity: string;
        dateRange?: unknown;
      } = {
        dimension: td.dimension,
        granularity,
      };
      if (typeof dateRange === "string") {
        item.dateRange = dateRange;
      }
      next.push(item);
      continue;
    }

    // Named ranges ("Last 7 days") only exist on timeDimensions in Cube.js.
    if (typeof dateRange === "string") {
      next.push({ dimension: td.dimension, dateRange });
    }
  }

  return next;
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
  const filters = flattenFilters(Array.isArray(query.filters) ? query.filters : []);
  const timeDimensions = normalizeTimeDimensions(
    Array.isArray(query.timeDimensions) ? query.timeDimensions : [],
    filters
  );

  const next: PlaygroundState = {
    ...initialState,
    measures: Array.isArray(query.measures) ? query.measures : [],
    dimensions: Array.isArray(query.dimensions) ? query.dimensions : [],
    filters: filters as PlaygroundState["filters"],
    timeDimensions: timeDimensions as PlaygroundState["timeDimensions"],
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
