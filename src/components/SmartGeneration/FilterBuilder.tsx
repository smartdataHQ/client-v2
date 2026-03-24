import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, InputNumber, Select, Space, Input, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import AuthTokensStore from "@/stores/AuthTokensStore";

import type { FC } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterCondition {
  column: string;
  operator: string;
  value: any;
}

export interface SchemaColumn {
  name: string;
  raw_type: string;
  value_type: string;
}

/**
 * Maps raw ClickHouse column name → Cube.js fully-qualified dimension member.
 * Built from `meta.source_column` on each dimension in the Cube.js meta response.
 */
export type DimensionMap = Record<string, string>;

export interface FilterBuilderProps {
  schema: SchemaColumn[];
  filters: FilterCondition[];
  onChange: (filters: FilterCondition[]) => void;
  /**
   * Column → Cube.js dimension member map (from meta).
   * When provided, value lookups go through Cube.js load API.
   * When absent, falls back to /api/v1/column-values (direct query with partition).
   */
  dimensionMap?: DimensionMap;
  /** Table name — used for direct value lookups when no cube model exists */
  tableName?: string;
  /** Schema/database name — used for direct value lookups */
  tableSchema?: string;
  /** Datasource ID for auth headers */
  datasourceId?: string;
  /** Branch ID for auth headers */
  branchId?: string;
}

// ---------------------------------------------------------------------------
// Operator definitions — human-readable labels
// ---------------------------------------------------------------------------

interface OperatorDef {
  label: string;
  value: string;
}

const ALL_OPERATORS: OperatorDef[] = [
  { label: "equals (=)", value: "=" },
  { label: "not equals (\u2260)", value: "!=" },
  { label: "greater than (>)", value: ">" },
  { label: "greater or equal (\u2265)", value: ">=" },
  { label: "less than (<)", value: "<" },
  { label: "less or equal (\u2264)", value: "<=" },
  { label: "in list", value: "IN" },
  { label: "not in list", value: "NOT IN" },
  { label: "matches (LIKE)", value: "LIKE" },
  { label: "is empty", value: "IS NULL" },
  { label: "is not empty", value: "IS NOT NULL" },
];

const OPERATORS_BY_TYPE: Record<string, string[]> = {
  STRING: [
    "=",
    "!=",
    ">",
    ">=",
    "<",
    "<=",
    "IN",
    "NOT IN",
    "LIKE",
    "IS NULL",
    "IS NOT NULL",
  ],
  NUMBER: [
    "=",
    "!=",
    ">",
    ">=",
    "<",
    "<=",
    "IN",
    "NOT IN",
    "IS NULL",
    "IS NOT NULL",
  ],
  DATE: ["=", "!=", ">", ">=", "<", "<=", "IS NULL", "IS NOT NULL"],
  BOOLEAN: ["=", "!=", "IS NULL", "IS NOT NULL"],
};

const NO_VALUE_OPERATORS = new Set(["IS NULL", "IS NOT NULL"]);
const MULTI_VALUE_OPERATORS = new Set(["IN", "NOT IN"]);
const VALUE_LOOKUP_OPERATORS = new Set(["=", "!=", "IN", "NOT IN"]);
const MAX_FILTERS = 10;
const DEBOUNCE_MS = 300;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getValueType(schema: SchemaColumn[], columnName: string): string {
  const col = schema.find((c) => c.name === columnName);
  return col?.value_type?.toUpperCase() || "STRING";
}

function getOperatorsForType(valueType: string): OperatorDef[] {
  const allowed = OPERATORS_BY_TYPE[valueType] || OPERATORS_BY_TYPE.STRING;
  return ALL_OPERATORS.filter((op) => allowed.includes(op.value));
}

function normalizeText(value: unknown): string {
  if (value == null) return "";
  return String(value).toLowerCase().trim();
}

function findOrderedTokenStart(text: string, tokens: string[]): number {
  let cursor = 0;
  let firstStart = -1;
  for (const token of tokens) {
    const idx = text.indexOf(token, cursor);
    if (idx < 0) return -1;
    if (firstStart < 0) firstStart = idx;
    cursor = idx + token.length;
  }
  return firstStart;
}

function classifyColumnMatch(
  query: string,
  option: { label?: unknown; value?: unknown }
): { matched: boolean; tier: number; index: number } {
  const value = normalizeText(option?.value);
  const label = normalizeText(option?.label);
  const text = value || label;
  if (!query) return { matched: true, tier: 9, index: 0 };
  if (!text)
    return { matched: false, tier: 99, index: Number.MAX_SAFE_INTEGER };

  // Tier 0: exact match
  if (text === query || label === query) {
    return { matched: true, tier: 0, index: 0 };
  }

  // Tier 1: left-most prefix match
  if (text.startsWith(query)) {
    return { matched: true, tier: 1, index: 0 };
  }

  // Tier 2/3: ordered token match from left to right
  const queryTokens = query.split(/\s+/).filter(Boolean);
  const orderedIdx = findOrderedTokenStart(text, queryTokens);
  if (orderedIdx >= 0) {
    const atBoundary =
      orderedIdx === 0 || /[._\-\s]/.test(text[orderedIdx - 1] || "");
    return { matched: true, tier: atBoundary ? 2 : 3, index: orderedIdx };
  }

  return { matched: false, tier: 99, index: Number.MAX_SAFE_INTEGER };
}

function isKeyValueColumn(columnName: string): boolean {
  const name = normalizeText(columnName);
  return (
    name.includes(".key") ||
    name.includes(".value") ||
    name.endsWith("_key") ||
    name.endsWith("_value") ||
    name.includes("key.") ||
    name.includes("value.")
  );
}

// ---------------------------------------------------------------------------
// Cube.js load API — same pipeline as Explore page
// ---------------------------------------------------------------------------

/**
 * Map a filter-builder operator to a Cube.js filter operator.
 * Only operators that make sense for narrowing value candidates are mapped.
 */
function toCubeOperator(op: string): string | null {
  switch (op) {
    case "=":
      return "equals";
    case "!=":
      return "notEquals";
    case ">":
      return "gt";
    case ">=":
      return "gte";
    case "<":
      return "lt";
    case "<=":
      return "lte";
    case "IS NULL":
      return "notSet";
    case "IS NOT NULL":
      return "set";
    default:
      return null;
  }
}

/**
 * Convert completed sibling FilterConditions into Cube.js filter objects.
 * Only includes filters that have a corresponding dimension in the map.
 */
function buildCubeFilters(
  siblings: FilterCondition[],
  dimensionMap: DimensionMap
): any[] {
  const cubeFilters: any[] = [];
  for (const f of siblings) {
    if (!f.column || !f.operator) continue;
    const member = dimensionMap[f.column];
    if (!member) continue;

    const cubeOp = toCubeOperator(f.operator);
    if (!cubeOp) continue; // skip IN/NOT IN/LIKE — complex to translate

    if (cubeOp === "set" || cubeOp === "notSet") {
      cubeFilters.push({ member, operator: cubeOp });
    } else if (f.value != null && f.value !== "") {
      cubeFilters.push({
        member,
        operator: cubeOp,
        values: [String(f.value)],
      });
    }
  }
  return cubeFilters;
}

async function loadCubeValues(
  member: string,
  searchTerm: string,
  siblingCubeFilters: any[],
  datasourceId: string,
  branchId: string | undefined,
  signal: AbortSignal
): Promise<string[]> {
  const token =
    AuthTokensStore.getState().workosAccessToken ||
    AuthTokensStore.getState().accessToken;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-hasura-datasource-id": datasourceId,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (branchId) headers["x-hasura-branch-id"] = branchId;

  const filters: any[] = [...siblingCubeFilters];

  // Server-side partial matching via Cube.js `contains` filter
  if (searchTerm.trim()) {
    filters.push({
      member,
      operator: "contains",
      values: [searchTerm.trim()],
    });
  }

  const query: Record<string, any> = {
    dimensions: [member],
    limit: 200,
    order: { [member]: "asc" },
  };
  if (filters.length > 0) query.filters = filters;

  // Cube.js may return "Continue wait" while compiling — retry up to 3 times
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("/api/v1/load", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
      signal,
    });

    if (!res.ok) return [];
    const data = await res.json();

    if (data.error === "Continue wait") {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    const rows: any[] = data.data || [];
    return [
      ...new Set(
        rows
          .map((r) => r[member])
          .filter((v) => v != null && v !== "")
          .map(String)
      ),
    ];
  }

  return []; // all retries exhausted
}

/**
 * Direct column-values endpoint — works without a cube model.
 * Goes through the same checkAuth + driverFactory pipeline as profile-table,
 * so partition filtering is applied from the security context.
 */
async function loadDirectValues(
  tableName: string,
  tableSchema: string,
  column: string,
  searchTerm: string,
  siblingFilters: FilterCondition[],
  datasourceId: string,
  branchId: string | undefined,
  signal: AbortSignal
): Promise<string[]> {
  const token =
    AuthTokensStore.getState().workosAccessToken ||
    AuthTokensStore.getState().accessToken;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-hasura-datasource-id": datasourceId,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (branchId) headers["x-hasura-branch-id"] = branchId;

  const completed = siblingFilters.filter(
    (f) =>
      f.column &&
      f.operator &&
      (f.value != null || NO_VALUE_OPERATORS.has(f.operator))
  );

  const body: Record<string, any> = {
    table: tableName,
    schema: tableSchema,
    column,
    limit: 200,
  };
  if (searchTerm.trim()) body.search = searchTerm.trim();
  if (completed.length > 0) body.filters = completed;

  const res = await fetch("/api/v1/column-values", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.values) ? data.values : [];
}

// ---------------------------------------------------------------------------
// Value lookup hook — Cube.js load when available, direct query as fallback
// ---------------------------------------------------------------------------

function useColumnValues(
  column: string,
  siblingFilters: FilterCondition[],
  dimensionMember: string | undefined,
  dimensionMap: DimensionMap | undefined,
  tableName: string | undefined,
  tableSchema: string | undefined,
  datasourceId: string | undefined,
  branchId: string | undefined
): {
  values: string[];
  loading: boolean;
  onSearch: (term: string) => void;
} {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mutable refs for the debounced search closure
  const argsRef = useRef({
    column,
    siblingFilters,
    dimensionMember,
    dimensionMap,
    tableName,
    tableSchema,
    datasourceId,
    branchId,
  });
  argsRef.current = {
    column,
    siblingFilters,
    dimensionMember,
    dimensionMap,
    tableName,
    tableSchema,
    datasourceId,
    branchId,
  };

  // Stable key for sibling filters
  const siblingKey = useMemo(() => {
    const completed = siblingFilters.filter(
      (f) =>
        f.column &&
        f.operator &&
        (f.value != null || NO_VALUE_OPERATORS.has(f.operator))
    );
    return JSON.stringify(completed);
  }, [siblingFilters]);

  // Unified fetch function — Cube.js load if available, direct endpoint otherwise
  const doFetch = useCallback(
    (searchTerm: string, signal: AbortSignal) => {
      const a = argsRef.current;
      if (a.tableName && a.tableSchema && a.column && a.datasourceId) {
        // Prefer direct table query so value options are always sourced
        // from the currently selected table/schema in Smart Generate.
        return loadDirectValues(
          a.tableName,
          a.tableSchema,
          a.column,
          searchTerm,
          a.siblingFilters,
          a.datasourceId,
          a.branchId,
          signal
        );
      }
      if (a.dimensionMember && a.dimensionMap && a.datasourceId) {
        // Fallback path when table context is unavailable
        const cubeFilters = buildCubeFilters(a.siblingFilters, a.dimensionMap);
        return loadCubeValues(
          a.dimensionMember,
          searchTerm,
          cubeFilters,
          a.datasourceId,
          a.branchId,
          signal
        );
      }
      return Promise.resolve([]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Fetch when column, dimension member, or sibling filters change
  useEffect(() => {
    if (!column || !datasourceId) {
      setValues([]);
      return;
    }
    // Need either a cube dimension OR table info
    if (!dimensionMember && (!tableName || !tableSchema)) {
      setValues([]);
      return;
    }

    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;

    setLoading(true);
    doFetch("", ctl.signal)
      .then((v) => {
        if (!ctl.signal.aborted) setValues(v);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setValues([]);
      })
      .finally(() => {
        if (!ctl.signal.aborted) setLoading(false);
      });

    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    column,
    dimensionMember,
    datasourceId,
    branchId,
    tableName,
    tableSchema,
    siblingKey,
  ]);

  // Debounced search as user types
  const onSearch = useCallback(
    (term: string) => {
      const a = argsRef.current;
      if (!a.column || !a.datasourceId) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        abortRef.current?.abort();
        const ctl = new AbortController();
        abortRef.current = ctl;

        setLoading(true);
        doFetch(term, ctl.signal)
          .then((v) => {
            if (!ctl.signal.aborted) setValues(v);
          })
          .catch((e) => {
            if (e.name !== "AbortError") setValues([]);
          })
          .finally(() => {
            if (!ctl.signal.aborted) setLoading(false);
          });
      }, DEBOUNCE_MS);
    },
    [doFetch]
  );

  return { values, loading, onSearch };
}

// ---------------------------------------------------------------------------
// Value editor
// ---------------------------------------------------------------------------

const ValueEditor: FC<{
  operator: string;
  valueType: string;
  value: any;
  onChange: (value: any) => void;
  lookupValues: string[];
  lookupLoading: boolean;
  hasLookup: boolean;
  onSearch: (term: string) => void;
}> = ({
  operator,
  valueType,
  value,
  onChange,
  lookupValues,
  lookupLoading,
  hasLookup,
  onSearch,
}) => {
  if (NO_VALUE_OPERATORS.has(operator)) return null;

  const useLookup = hasLookup && VALUE_LOOKUP_OPERATORS.has(operator);

  if (MULTI_VALUE_OPERATORS.has(operator)) {
    return (
      <Select
        mode="tags"
        style={{ minWidth: 240 }}
        size="small"
        placeholder={
          lookupLoading ? "Searching..." : "Type to search values..."
        }
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        tokenSeparators={[","]}
        loading={lookupLoading}
        showSearch
        onSearch={useLookup ? onSearch : undefined}
        filterOption={
          useLookup
            ? false
            : (input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
        }
        options={
          useLookup && lookupValues.length > 0
            ? lookupValues.map((v) => ({ label: v, value: v }))
            : undefined
        }
        notFoundContent={
          lookupLoading ? (
            <Spin size="small" />
          ) : useLookup ? (
            "No matches"
          ) : null
        }
      />
    );
  }

  if (valueType === "BOOLEAN") {
    return (
      <Select
        style={{ width: 100 }}
        size="small"
        placeholder="Value"
        value={value}
        onChange={onChange}
        options={[
          { label: "true", value: true },
          { label: "false", value: false },
        ]}
      />
    );
  }

  if (useLookup) {
    return (
      <Select
        showSearch
        allowClear
        style={{ minWidth: 240 }}
        size="small"
        placeholder={lookupLoading ? "Loading..." : "Type to search values..."}
        value={value ?? undefined}
        onChange={onChange}
        loading={lookupLoading}
        onSearch={onSearch}
        filterOption={false}
        options={lookupValues.map((v) => ({ label: v, value: v }))}
        notFoundContent={lookupLoading ? <Spin size="small" /> : "No matches"}
      />
    );
  }

  if (valueType === "NUMBER") {
    return (
      <InputNumber
        style={{ width: 140 }}
        size="small"
        placeholder="Value"
        value={value}
        onChange={onChange}
      />
    );
  }

  if (valueType === "DATE") {
    return (
      <Input
        style={{ width: 180 }}
        size="small"
        placeholder="YYYY-MM-DD"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <Input
      style={{ width: 180 }}
      size="small"
      placeholder="Value"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

// ---------------------------------------------------------------------------
// Single filter row
// ---------------------------------------------------------------------------

const FilterRow: FC<{
  filter: FilterCondition;
  index: number;
  schema: SchemaColumn[];
  columnOptions: { label: string; value: string }[];
  siblingFilters: FilterCondition[];
  dimensionMap?: DimensionMap;
  tableName?: string;
  tableSchema?: string;
  datasourceId?: string;
  branchId?: string;
  onColumnChange: (index: number, column: string) => void;
  onOperatorChange: (index: number, operator: string) => void;
  onValueChange: (index: number, value: any) => void;
  onRemove: (index: number) => void;
}> = ({
  filter,
  index,
  schema,
  columnOptions,
  siblingFilters,
  dimensionMap,
  tableName,
  tableSchema,
  datasourceId,
  branchId,
  onColumnChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}) => {
  const vt = getValueType(schema, filter.column);
  const operators = getOperatorsForType(vt);
  const [columnSearch, setColumnSearch] = useState("");

  const dimensionMember = dimensionMap?.[filter.column];

  const { values, loading, onSearch } = useColumnValues(
    filter.column,
    siblingFilters,
    dimensionMember,
    dimensionMap,
    tableName,
    tableSchema,
    datasourceId,
    branchId
  );

  const filteredColumnOptions = useMemo(() => {
    const query = normalizeText(columnSearch);
    if (!query) return columnOptions;

    return columnOptions
      .map((option, originalIndex) => {
        const match = classifyColumnMatch(query, option);
        return { option, originalIndex, ...match };
      })
      .filter((entry) => entry.matched)
      .sort((a, b) => {
        // New search behavior: strict left-to-right ordering.
        if (a.tier !== b.tier) return a.tier - b.tier;
        if (a.index !== b.index) return a.index - b.index;
        if (a.originalIndex !== b.originalIndex) {
          return a.originalIndex - b.originalIndex;
        }
        return a.option.value.localeCompare(b.option.value);
      })
      .map((entry) => entry.option);
  }, [columnOptions, columnSearch]);

  return (
    <Space size={8} align="center" wrap>
      <Select
        showSearch
        style={{ width: 360 }}
        size="small"
        placeholder="Column"
        value={filter.column || undefined}
        onChange={(val) => {
          onColumnChange(index, val);
          setColumnSearch("");
        }}
        onSearch={setColumnSearch}
        onBlur={() => setColumnSearch("")}
        popupMatchSelectWidth={false}
        dropdownStyle={{ width: 520 }}
        optionFilterProp="label"
        filterOption={false}
        options={filteredColumnOptions}
      />
      <Select
        style={{ width: 160 }}
        size="small"
        value={filter.operator}
        onChange={(val) => onOperatorChange(index, val)}
        options={operators}
      />
      <ValueEditor
        operator={filter.operator}
        valueType={vt}
        value={filter.value}
        onChange={(val) => onValueChange(index, val)}
        lookupValues={values}
        lookupLoading={loading}
        hasLookup={
          !!dimensionMember || (!!tableName && !!tableSchema && !!datasourceId)
        }
        onSearch={onSearch}
      />
      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => onRemove(index)}
        style={{ color: "#999" }}
      />
    </Space>
  );
};

// ---------------------------------------------------------------------------
// FilterBuilder
// ---------------------------------------------------------------------------

const FilterBuilder: FC<FilterBuilderProps> = ({
  schema,
  filters,
  onChange,
  dimensionMap,
  tableName,
  tableSchema,
  datasourceId,
  branchId,
}) => {
  const columnOptions = useMemo(
    () =>
      schema
        .map((col) => ({ label: col.name, value: col.name }))
        .sort((a, b) => {
          const aKeyValue = isKeyValueColumn(a.value);
          const bKeyValue = isKeyValueColumn(b.value);

          if (aKeyValue !== bKeyValue) {
            return aKeyValue ? -1 : 1;
          }

          return a.value.localeCompare(b.value);
        }),
    [schema]
  );

  const updateFilter = useCallback(
    (index: number, patch: Partial<FilterCondition>) => {
      onChange(filters.map((f, i) => (i === index ? { ...f, ...patch } : f)));
    },
    [filters, onChange]
  );

  const removeFilter = useCallback(
    (index: number) => onChange(filters.filter((_, i) => i !== index)),
    [filters, onChange]
  );

  const addFilter = useCallback(() => {
    if (filters.length >= MAX_FILTERS) return;
    onChange([...filters, { column: "", operator: "=", value: null }]);
  }, [filters, onChange]);

  const handleColumnChange = useCallback(
    (index: number, column: string) => {
      const vt = getValueType(schema, column);
      const currentOp = filters[index].operator;
      const allowed = OPERATORS_BY_TYPE[vt] || OPERATORS_BY_TYPE.STRING;
      const operator = allowed.includes(currentOp) ? currentOp : "=";
      updateFilter(index, { column, operator, value: null });
    },
    [schema, filters, updateFilter]
  );

  const handleOperatorChange = useCallback(
    (index: number, operator: string) => {
      let value = filters[index].value;
      if (NO_VALUE_OPERATORS.has(operator)) value = null;
      else if (MULTI_VALUE_OPERATORS.has(operator) && !Array.isArray(value))
        value = [];
      else if (!MULTI_VALUE_OPERATORS.has(operator) && Array.isArray(value))
        value = null;
      updateFilter(index, { operator, value });
    },
    [filters, updateFilter]
  );

  return (
    <div>
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        {filters.map((filter, index) => (
          <FilterRow
            key={index}
            filter={filter}
            index={index}
            schema={schema}
            columnOptions={columnOptions}
            siblingFilters={filters.filter((_, i) => i !== index)}
            dimensionMap={dimensionMap}
            tableName={tableName}
            tableSchema={tableSchema}
            datasourceId={datasourceId}
            branchId={branchId}
            onColumnChange={handleColumnChange}
            onOperatorChange={handleOperatorChange}
            onValueChange={(i, val) => updateFilter(i, { value: val })}
            onRemove={removeFilter}
          />
        ))}
      </Space>
      <div style={{ marginTop: filters.length > 0 ? 8 : 0 }}>
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          disabled={filters.length >= MAX_FILTERS}
          onClick={addFilter}
        >
          Add Filter
          {filters.length >= MAX_FILTERS ? ` (max ${MAX_FILTERS})` : ""}
        </Button>
      </div>
    </div>
  );
};

export default FilterBuilder;
