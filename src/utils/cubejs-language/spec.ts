/**
 * Static Cube.js v1.6.19 schema specification.
 *
 * Extracted from @cubejs-backend/schema-compiler CubeValidator.js.
 * This is the single source of truth for all valid model properties,
 * used by the language service for completions, hover, and validation.
 */
import type {
  SchemaSpec,
  ConstructSpec,
  PropertySpec,
  MemberTypeSpec,
  TemplateVariableSpec,
  PropertyValueType,
} from "./types";

// ---------------------------------------------------------------------------
// Version
// ---------------------------------------------------------------------------

export const CUBEJS_SPEC_VERSION = "1.6.19";

// ---------------------------------------------------------------------------
// Helper: property factory
// ---------------------------------------------------------------------------

function prop(
  key: string,
  type: PropertyValueType,
  description: string,
  options: Partial<Omit<PropertySpec, "key" | "type" | "description">> = {}
): PropertySpec {
  const yamlKey = camelToSnake(key);
  return {
    key,
    jsKey: key,
    yamlKey,
    type,
    required: false,
    description,
    ...options,
  };
}

/**
 * Convert camelCase to snake_case, preserving existing snake_case.
 * We override specific mappings below where the automatic conversion
 * would be wrong (e.g., "sqlTable" -> "sql_table").
 */
function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

// ---------------------------------------------------------------------------
// YAML <-> JS key mapping overrides
// ---------------------------------------------------------------------------

/** Where automatic camelToSnake is not sufficient, override yamlKey. */
function withYamlKey(p: PropertySpec, yamlKey: string): PropertySpec {
  return { ...p, yamlKey };
}

// ---------------------------------------------------------------------------
// Refresh Key Schemas
// ---------------------------------------------------------------------------

const cubeRefreshKeyProperties: Record<string, PropertySpec> = {
  every: prop(
    "every",
    "string",
    'Refresh interval (e.g., "1 hour") or cron expression (e.g., "0 * * * *")'
  ),
  sql: prop(
    "sql",
    "sql",
    "SQL query that triggers refresh when its result changes"
  ),
  timezone: prop(
    "timezone",
    "string",
    'Timezone for cron-based refresh schedules (e.g., "America/Los_Angeles")'
  ),
  immutable: prop(
    "immutable",
    "boolean",
    "When true, data is never refreshed after first load"
  ),
};

const preAggregationRefreshKeyProperties: Record<string, PropertySpec> = {
  every: prop(
    "every",
    "string",
    'Refresh interval (e.g., "1 hour") or cron expression'
  ),
  sql: prop(
    "sql",
    "sql",
    "SQL query that triggers refresh when its result changes"
  ),
  timezone: prop(
    "timezone",
    "string",
    "Timezone for cron-based refresh schedules"
  ),
  incremental: prop(
    "incremental",
    "boolean",
    "When true, only refreshes new partitions instead of all"
  ),
  updateWindow: withYamlKey(
    prop(
      "updateWindow",
      "string",
      'Time window for incremental refresh to re-process (e.g., "1 day")'
    ),
    "update_window"
  ),
};

// ---------------------------------------------------------------------------
// Index properties (pre-aggregation indexes)
// ---------------------------------------------------------------------------

const indexProperties: Record<string, PropertySpec> = {
  columns: prop(
    "columns",
    "function",
    "References to columns to include in the index"
  ),
  type: prop("type", "enum", "Index type", {
    values: ["regular", "aggregate"],
  }),
};

// ---------------------------------------------------------------------------
// Rolling Window children
// ---------------------------------------------------------------------------

const rollingWindowProperties: Record<string, PropertySpec> = {
  type: prop("type", "enum", "Rolling window type", {
    values: [
      "fixed",
      "year_to_date",
      "quarter_to_date",
      "month_to_date",
      "to_date",
    ],
  }),
  trailing: prop(
    "trailing",
    "string",
    'Trailing interval for fixed rolling window (e.g., "7 day")'
  ),
  leading: prop(
    "leading",
    "string",
    'Leading interval for fixed rolling window (e.g., "1 day")'
  ),
  offset: prop("offset", "enum", "Offset alignment for fixed rolling window", {
    values: ["start", "end"],
  }),
  granularity: prop(
    "granularity",
    "string",
    'Granularity for to_date rolling windows (e.g., "year", "quarter", "month")'
  ),
};

// ---------------------------------------------------------------------------
// Access Policy children
// ---------------------------------------------------------------------------

const filterOperators = [
  "equals",
  "notEquals",
  "contains",
  "notContains",
  "startsWith",
  "notStartsWith",
  "endsWith",
  "notEndsWith",
  "in",
  "notIn",
  "gt",
  "gte",
  "lt",
  "lte",
  "set",
  "notSet",
  "inDateRange",
  "notInDateRange",
  "onTheDate",
  "beforeDate",
  "beforeOrOnDate",
  "afterDate",
  "afterOrOnDate",
  "measureFilter",
];

const memberLevelProperties: Record<string, PropertySpec> = {
  includes: prop(
    "includes",
    "array",
    'Members to include ("*" for all, or array of member names)'
  ),
  excludes: prop(
    "excludes",
    "array",
    'Members to exclude ("*" for all, or array of member names)'
  ),
  includesMembers: withYamlKey(
    prop("includesMembers", "array", "Explicit member references to include"),
    "includes_members"
  ),
  excludesMembers: withYamlKey(
    prop("excludesMembers", "array", "Explicit member references to exclude"),
    "excludes_members"
  ),
};

const rowLevelFilterProperties: Record<string, PropertySpec> = {
  member: prop("member", "string", "Member reference for the filter"),
  operator: prop("operator", "enum", "Filter operator", {
    values: filterOperators,
  }),
  values: prop("values", "array", "Filter values"),
};

const rowLevelProperties: Record<string, PropertySpec> = {
  filters: prop(
    "filters",
    "array",
    "Row-level security filters (mutually exclusive with allowAll)",
    {
      children: rowLevelFilterProperties,
    }
  ),
  allowAll: withYamlKey(
    prop(
      "allowAll",
      "boolean",
      "Allow all rows (mutually exclusive with filters)"
    ),
    "allow_all"
  ),
};

const conditionProperties: Record<string, PropertySpec> = {
  if: prop("if", "function", "Condition function that returns a boolean"),
};

const accessPolicyProperties: Record<string, PropertySpec> = {
  role: prop("role", "string", "Role name this policy applies to", {
    required: true,
  }),
  memberLevel: withYamlKey(
    prop(
      "memberLevel",
      "object",
      "Member-level access restrictions (which measures/dimensions are visible)",
      {
        children: memberLevelProperties,
      }
    ),
    "member_level"
  ),
  rowLevel: withYamlKey(
    prop("rowLevel", "object", "Row-level security filters", {
      children: rowLevelProperties,
    }),
    "row_level"
  ),
  conditions: prop("conditions", "array", "Conditional policy application", {
    children: conditionProperties,
  }),
};

// ---------------------------------------------------------------------------
// View cubes item properties
// ---------------------------------------------------------------------------

const viewCubeItemProperties: Record<string, PropertySpec> = {
  joinPath: withYamlKey(
    prop("joinPath", "function", "Join path reference to the cube", {
      required: true,
    }),
    "join_path"
  ),
  prefix: prop(
    "prefix",
    "boolean",
    "Whether to prefix member names with the cube name"
  ),
  split: prop(
    "split",
    "boolean",
    "Whether to split the cube members across separate namespaces"
  ),
  alias: prop("alias", "string", "Alias for the cube reference in the view"),
  includes: prop(
    "includes",
    "array",
    'Members to include ("*" for all, or array of member names)'
  ),
  excludes: prop(
    "excludes",
    "array",
    "Members to exclude (array of member names)"
  ),
};

// ---------------------------------------------------------------------------
// View folders item properties
// ---------------------------------------------------------------------------

const viewFolderItemProperties: Record<string, PropertySpec> = {
  name: prop("name", "string", "Folder display name", { required: true }),
  includes: prop(
    "includes",
    "array",
    'Members to include ("*" for all, or array of member names)'
  ),
};

// ---------------------------------------------------------------------------
// Granularity properties (for time dimensions)
// ---------------------------------------------------------------------------

const granularityProperties: Record<string, PropertySpec> = {
  title: prop("title", "string", "Display title for the custom granularity"),
  interval: prop(
    "interval",
    "string",
    'Interval duration (e.g., "1 week", "2 hours")',
    { required: true }
  ),
  origin: prop(
    "origin",
    "string",
    "Origin point for the granularity alignment"
  ),
  offset: prop("offset", "string", "Offset from the origin for alignment"),
};

// ---------------------------------------------------------------------------
// Case property children
// ---------------------------------------------------------------------------

const caseWhenProperties: Record<string, PropertySpec> = {
  sql: prop("sql", "sql", "SQL condition for this case branch", {
    required: true,
  }),
  label: prop("label", "object", "Label value when the condition is true", {
    required: true,
  }),
};

const caseElseProperties: Record<string, PropertySpec> = {
  label: prop("label", "object", "Default label when no conditions match", {
    required: true,
  }),
};

const caseProperties: Record<string, PropertySpec> = {
  when: prop("when", "array", "Array of conditional branches", {
    required: true,
    children: caseWhenProperties,
  }),
  else: prop("else", "object", "Default value when no conditions match", {
    children: caseElseProperties,
  }),
};

// ---------------------------------------------------------------------------
// Geo sub-properties
// ---------------------------------------------------------------------------

const geoSubProperties: Record<string, PropertySpec> = {
  sql: prop("sql", "sql", "SQL expression for the coordinate value", {
    required: true,
  }),
};

// ---------------------------------------------------------------------------
// Format (object form) properties
// ---------------------------------------------------------------------------

const formatObjectProperties: Record<string, PropertySpec> = {
  type: prop("type", "enum", "Format type", {
    required: true,
    values: ["link", "currency", "percent", "number", "id"],
  }),
  label: prop("label", "string", "Display label for link format"),
};

// ---------------------------------------------------------------------------
// Multi-stage orderBy children
// ---------------------------------------------------------------------------

const orderByProperties: Record<string, PropertySpec> = {
  sql: prop("sql", "sql", "SQL expression or member reference to order by", {
    required: true,
  }),
  dir: prop("dir", "enum", "Sort direction", {
    required: true,
    values: ["asc", "desc"],
  }),
};

// ---------------------------------------------------------------------------
// Output column types children
// ---------------------------------------------------------------------------

const outputColumnTypeProperties: Record<string, PropertySpec> = {
  member: prop("member", "string", "Member reference for the output column"),
  type: prop("type", "string", "SQL type to cast the output column to"),
};

// ---------------------------------------------------------------------------
// Dimension Properties
// ---------------------------------------------------------------------------

const dimensionProperties: Record<string, PropertySpec> = {
  sql: prop("sql", "sql", "SQL expression for this dimension"),
  type: prop("type", "enum", "Data type of this dimension", {
    required: true,
    values: ["string", "number", "boolean", "time", "geo"],
  }),
  aliases: prop("aliases", "array", "Alternative names for this dimension"),
  fieldType: withYamlKey(
    prop("fieldType", "string", "Database field type hint"),
    "field_type"
  ),
  valuesAsSegments: withYamlKey(
    prop("valuesAsSegments", "boolean", "Treat dimension values as segments"),
    "values_as_segments"
  ),
  primaryKey: withYamlKey(
    prop("primaryKey", "boolean", "Mark this dimension as the primary key"),
    "primary_key"
  ),
  shown: prop("shown", "boolean", "Whether to show this dimension in the UI", {
    deprecated: true,
    deprecatedBy: "public",
  }),
  public: prop(
    "public",
    "boolean",
    "Whether this dimension is visible to API consumers"
  ),
  title: prop("title", "string", "Display title for this dimension"),
  description: prop(
    "description",
    "string",
    "Description of this dimension (shown in tooltips)"
  ),
  suggestFilterValues: withYamlKey(
    prop(
      "suggestFilterValues",
      "boolean",
      "Whether to suggest filter values for this dimension"
    ),
    "suggest_filter_values"
  ),
  enableSuggestions: withYamlKey(
    prop(
      "enableSuggestions",
      "boolean",
      "Whether to enable autocomplete suggestions for values"
    ),
    "enable_suggestions"
  ),
  format: prop(
    "format",
    "enum",
    "Display format for the dimension value (string or object form)",
    {
      values: ["link", "currency", "percent", "number", "id"],
      children: formatObjectProperties,
    }
  ),
  meta: prop(
    "meta",
    "object",
    "Arbitrary metadata object (passed through to API responses)"
  ),
  subQuery: withYamlKey(
    prop(
      "subQuery",
      "boolean",
      "Evaluate this dimension as a sub-query against another cube"
    ),
    "sub_query"
  ),
  propagateFiltersToSubQuery: withYamlKey(
    prop(
      "propagateFiltersToSubQuery",
      "boolean",
      "Propagate query filters into the sub-query"
    ),
    "propagate_filters_to_sub_query"
  ),
  case: prop("case", "object", "Case expression with when/else branches", {
    children: caseProperties,
  }),
  latitude: prop(
    "latitude",
    "object",
    "Latitude SQL expression (only for geo type)",
    {
      children: geoSubProperties,
    }
  ),
  longitude: prop(
    "longitude",
    "object",
    "Longitude SQL expression (only for geo type)",
    {
      children: geoSubProperties,
    }
  ),
  granularities: prop(
    "granularities",
    "object",
    "Custom granularity definitions (only for time type)",
    {
      children: granularityProperties,
    }
  ),
  multiStage: withYamlKey(
    prop(
      "multiStage",
      "boolean",
      "Enable multi-stage query execution for this dimension (type=number only)"
    ),
    "multi_stage"
  ),
  addGroupBy: withYamlKey(
    prop(
      "addGroupBy",
      "function",
      "Additional group-by references for multi-stage dimensions"
    ),
    "add_group_by"
  ),
};

// ---------------------------------------------------------------------------
// Measure Properties
// ---------------------------------------------------------------------------

const measureTypes = [
  "count",
  "number",
  "string",
  "boolean",
  "time",
  "sum",
  "avg",
  "min",
  "max",
  "countDistinct",
  "countDistinctApprox",
  "runningTotal",
];

const measureTypesMultiStage = [...measureTypes, "numberAgg", "rank"];

const measureProperties: Record<string, PropertySpec> = {
  sql: prop(
    "sql",
    "sql",
    "SQL expression for this measure (required for all types except count)"
  ),
  type: prop("type", "enum", "Aggregation type for this measure", {
    required: true,
    values: measureTypesMultiStage,
  }),
  aliases: prop("aliases", "array", "Alternative names for this measure"),
  format: prop("format", "enum", "Display format for the measure value", {
    values: ["percent", "currency", "number"],
  }),
  public: prop(
    "public",
    "boolean",
    "Whether this measure is visible to API consumers"
  ),
  visible: prop(
    "visible",
    "boolean",
    "Whether this measure is visible (deprecated)",
    {
      deprecated: true,
      deprecatedBy: "public",
    }
  ),
  shown: prop("shown", "boolean", "Whether to show this measure in the UI", {
    deprecated: true,
    deprecatedBy: "public",
  }),
  cumulative: prop(
    "cumulative",
    "boolean",
    "Whether this measure is cumulative"
  ),
  filters: prop("filters", "array", "Pre-filters applied before aggregation", {
    children: {
      sql: prop("sql", "sql", "SQL boolean expression for the filter", {
        required: true,
      }),
    },
  }),
  title: prop("title", "string", "Display title for this measure"),
  description: prop(
    "description",
    "string",
    "Description of this measure (shown in tooltips)"
  ),
  rollingWindow: withYamlKey(
    prop(
      "rollingWindow",
      "object",
      "Rolling window configuration for time-based aggregation",
      {
        children: rollingWindowProperties,
      }
    ),
    "rolling_window"
  ),
  drillMembers: withYamlKey(
    prop(
      "drillMembers",
      "function",
      "Dimension/measure references shown when drilling into this measure"
    ),
    "drill_members"
  ),
  drillMemberReferences: withYamlKey(
    prop(
      "drillMemberReferences",
      "function",
      "Dimension/measure references for drill-down (deprecated)",
      {
        deprecated: true,
        deprecatedBy: "drillMembers",
      }
    ),
    "drill_member_references"
  ),
  drillFilters: withYamlKey(
    prop(
      "drillFilters",
      "array",
      "Filters applied when drilling into this measure",
      {
        children: {
          sql: prop("sql", "sql", "SQL expression for the drill filter", {
            required: true,
          }),
        },
      }
    ),
    "drill_filters"
  ),
  meta: prop(
    "meta",
    "object",
    "Arbitrary metadata object (passed through to API responses)"
  ),
  multiStage: withYamlKey(
    prop(
      "multiStage",
      "boolean",
      "Enable multi-stage query execution (enables numberAgg, rank types)"
    ),
    "multi_stage"
  ),
  groupBy: withYamlKey(
    prop("groupBy", "function", "Group-by references for multi-stage measures"),
    "group_by"
  ),
  reduceBy: withYamlKey(
    prop(
      "reduceBy",
      "function",
      "Reduce-by references for multi-stage measures"
    ),
    "reduce_by"
  ),
  addGroupBy: withYamlKey(
    prop(
      "addGroupBy",
      "function",
      "Additional group-by references for multi-stage measures"
    ),
    "add_group_by"
  ),
  timeShift: withYamlKey(
    prop(
      "timeShift",
      "array",
      "Time shift configurations for multi-stage measures",
      {
        children: {
          timeDimension: withYamlKey(
            prop(
              "timeDimension",
              "function",
              "Time dimension reference to shift"
            ),
            "time_dimension"
          ),
          interval: prop(
            "interval",
            "string",
            'Shift interval (e.g., "1 year")'
          ),
          type: prop("type", "enum", "Shift type", {
            values: ["prior", "next"],
          }),
        },
      }
    ),
    "time_shift"
  ),
  orderBy: withYamlKey(
    prop("orderBy", "array", "Ordering for multi-stage measures (e.g., rank)", {
      children: orderByProperties,
    }),
    "order_by"
  ),
};

// ---------------------------------------------------------------------------
// Join Properties
// ---------------------------------------------------------------------------

const relationshipValues = [
  "belongsTo",
  "belongs_to",
  "many_to_one",
  "manyToOne",
  "hasMany",
  "has_many",
  "one_to_many",
  "oneToMany",
  "hasOne",
  "has_one",
  "one_to_one",
  "oneToOne",
];

const joinProperties: Record<string, PropertySpec> = {
  sql: prop("sql", "sql", "SQL ON clause for the join condition", {
    required: true,
  }),
  relationship: prop(
    "relationship",
    "enum",
    "Cardinality relationship between the cubes",
    {
      required: true,
      values: relationshipValues,
    }
  ),
};

// ---------------------------------------------------------------------------
// Segment Properties
// ---------------------------------------------------------------------------

const segmentProperties: Record<string, PropertySpec> = {
  sql: prop("sql", "sql", "SQL boolean expression defining this segment", {
    required: true,
  }),
  aliases: prop("aliases", "array", "Alternative names for this segment"),
  title: prop("title", "string", "Display title for this segment"),
  description: prop(
    "description",
    "string",
    "Description of this segment (shown in tooltips)"
  ),
  meta: prop(
    "meta",
    "object",
    "Arbitrary metadata object (passed through to API responses)"
  ),
  shown: prop("shown", "boolean", "Whether to show this segment in the UI", {
    deprecated: true,
    deprecatedBy: "public",
  }),
  public: prop(
    "public",
    "boolean",
    "Whether this segment is visible to API consumers"
  ),
};

// ---------------------------------------------------------------------------
// Pre-Aggregation Properties
// ---------------------------------------------------------------------------

const granularityValues = ["hour", "day", "week", "month", "quarter", "year"];

const preAggregationBaseProperties: Record<string, PropertySpec> = {
  type: prop("type", "enum", "Pre-aggregation type", {
    required: true,
    values: [
      "rollup",
      "originalSql",
      "rollupJoin",
      "rollupLambda",
      "autoRollup",
    ],
  }),
  refreshKey: withYamlKey(
    prop(
      "refreshKey",
      "object",
      "Refresh key configuration for this pre-aggregation",
      {
        children: preAggregationRefreshKeyProperties,
      }
    ),
    "refresh_key"
  ),
  sqlAlias: withYamlKey(
    prop(
      "sqlAlias",
      "string",
      "Custom SQL alias for the pre-aggregation table"
    ),
    "sql_alias"
  ),
  useOriginalSqlPreAggregations: withYamlKey(
    prop(
      "useOriginalSqlPreAggregations",
      "boolean",
      "Use original SQL pre-aggregations as a source"
    ),
    "use_original_sql_pre_aggregations"
  ),
  external: prop(
    "external",
    "boolean",
    "Store pre-aggregation in CubeStore (external database)"
  ),
  scheduledRefresh: withYamlKey(
    prop("scheduledRefresh", "boolean", "Enable or disable scheduled refresh"),
    "scheduled_refresh"
  ),
  indexes: prop(
    "indexes",
    "object",
    "Index definitions for this pre-aggregation",
    {
      children: indexProperties,
    }
  ),
  refreshRangeStart: withYamlKey(
    prop("refreshRangeStart", "object", "Start of refresh range (deprecated)", {
      deprecated: true,
      deprecatedBy: "buildRangeStart",
    }),
    "refresh_range_start"
  ),
  refreshRangeEnd: withYamlKey(
    prop("refreshRangeEnd", "object", "End of refresh range (deprecated)", {
      deprecated: true,
      deprecatedBy: "buildRangeEnd",
    }),
    "refresh_range_end"
  ),
  buildRangeStart: withYamlKey(
    prop(
      "buildRangeStart",
      "object",
      "Start boundary for the pre-aggregation build range",
      {
        children: {
          sql: prop("sql", "sql", "SQL expression returning the start date"),
        },
      }
    ),
    "build_range_start"
  ),
  buildRangeEnd: withYamlKey(
    prop(
      "buildRangeEnd",
      "object",
      "End boundary for the pre-aggregation build range",
      {
        children: {
          sql: prop("sql", "sql", "SQL expression returning the end date"),
        },
      }
    ),
    "build_range_end"
  ),
  readOnly: withYamlKey(
    prop(
      "readOnly",
      "boolean",
      "Mark pre-aggregation as read-only (no automatic refresh)"
    ),
    "read_only"
  ),
  streamOffset: withYamlKey(
    prop(
      "streamOffset",
      "enum",
      "Stream offset for Kafka/streaming pre-aggregations",
      {
        values: ["earliest", "latest"],
      }
    ),
    "stream_offset"
  ),
  outputColumnTypes: withYamlKey(
    prop("outputColumnTypes", "array", "Output column type overrides", {
      children: outputColumnTypeProperties,
    }),
    "output_column_types"
  ),
};

const preAggregationRollupProperties: Record<string, PropertySpec> = {
  ...preAggregationBaseProperties,
  measures: prop(
    "measures",
    "function",
    "Measure references to include in this rollup"
  ),
  dimensions: prop(
    "dimensions",
    "function",
    "Dimension references to include in this rollup"
  ),
  segments: prop(
    "segments",
    "function",
    "Segment references to include in this rollup"
  ),
  timeDimension: withYamlKey(
    prop(
      "timeDimension",
      "function",
      "Single time dimension reference for partitioning"
    ),
    "time_dimension"
  ),
  timeDimensions: withYamlKey(
    prop(
      "timeDimensions",
      "function",
      "Time dimension references for partitioning"
    ),
    "time_dimensions"
  ),
  granularity: prop("granularity", "enum", "Time granularity for aggregation", {
    values: granularityValues,
  }),
  partitionGranularity: withYamlKey(
    prop(
      "partitionGranularity",
      "enum",
      "Partition granularity for splitting the table",
      {
        values: granularityValues,
      }
    ),
    "partition_granularity"
  ),
  uniqueKeyColumns: withYamlKey(
    prop(
      "uniqueKeyColumns",
      "array",
      "Columns that form the unique key for lambda pre-aggregations"
    ),
    "unique_key_columns"
  ),
  allowNonStrictDateRangeMatch: withYamlKey(
    prop(
      "allowNonStrictDateRangeMatch",
      "boolean",
      "Allow non-strict date range matching for rollup selection"
    ),
    "allow_non_strict_date_range_match"
  ),
};

const preAggregationOriginalSqlProperties: Record<string, PropertySpec> = {
  ...preAggregationBaseProperties,
  timeDimension: withYamlKey(
    prop(
      "timeDimension",
      "function",
      "Time dimension reference for partitioning"
    ),
    "time_dimension"
  ),
  partitionGranularity: withYamlKey(
    prop(
      "partitionGranularity",
      "enum",
      "Partition granularity (required when timeDimension is set)",
      {
        values: granularityValues,
      }
    ),
    "partition_granularity"
  ),
  uniqueKeyColumns: withYamlKey(
    prop("uniqueKeyColumns", "array", "Columns forming the unique key"),
    "unique_key_columns"
  ),
  allowNonStrictDateRangeMatch: withYamlKey(
    prop(
      "allowNonStrictDateRangeMatch",
      "boolean",
      "Allow non-strict date range matching"
    ),
    "allow_non_strict_date_range_match"
  ),
};

const preAggregationRollupJoinProperties: Record<string, PropertySpec> = {
  ...preAggregationBaseProperties,
  rollups: prop(
    "rollups",
    "function",
    "References to rollup pre-aggregations to join",
    { required: true }
  ),
  measures: prop("measures", "function", "Measure references to include"),
  dimensions: prop("dimensions", "function", "Dimension references to include"),
  segments: prop("segments", "function", "Segment references to include"),
  timeDimension: withYamlKey(
    prop(
      "timeDimension",
      "function",
      "Time dimension reference for partitioning"
    ),
    "time_dimension"
  ),
  granularity: prop("granularity", "enum", "Time granularity for aggregation", {
    values: granularityValues,
  }),
  allowNonStrictDateRangeMatch: withYamlKey(
    prop(
      "allowNonStrictDateRangeMatch",
      "boolean",
      "Allow non-strict date range matching"
    ),
    "allow_non_strict_date_range_match"
  ),
};

const preAggregationRollupLambdaProperties: Record<string, PropertySpec> = {
  ...preAggregationBaseProperties,
  rollups: prop(
    "rollups",
    "function",
    "References to source rollup pre-aggregations",
    { required: true }
  ),
  measures: prop("measures", "function", "Measure references to include"),
  dimensions: prop("dimensions", "function", "Dimension references to include"),
  segments: prop("segments", "function", "Segment references to include"),
  timeDimension: withYamlKey(
    prop(
      "timeDimension",
      "function",
      "Time dimension reference for partitioning"
    ),
    "time_dimension"
  ),
  granularity: prop("granularity", "enum", "Time granularity for aggregation", {
    values: granularityValues,
  }),
  unionWithSourceData: withYamlKey(
    prop(
      "unionWithSourceData",
      "boolean",
      "Union pre-aggregated data with real-time source data"
    ),
    "union_with_source_data"
  ),
};

const preAggregationAutoRollupProperties: Record<string, PropertySpec> = {
  ...preAggregationBaseProperties,
  maxPreAggregations: withYamlKey(
    prop(
      "maxPreAggregations",
      "number",
      "Maximum number of auto-rollup pre-aggregations to create"
    ),
    "max_pre_aggregations"
  ),
};

// Merged: all pre-aggregation properties (union of all types)
const preAggregationProperties: Record<string, PropertySpec> = {
  ...preAggregationRollupProperties,
  ...preAggregationOriginalSqlProperties,
  ...preAggregationRollupJoinProperties,
  ...preAggregationRollupLambdaProperties,
  ...preAggregationAutoRollupProperties,
};

// ---------------------------------------------------------------------------
// Hierarchy properties
// ---------------------------------------------------------------------------

const hierarchyProperties: Record<string, PropertySpec> = {
  title: prop("title", "string", "Display title for this hierarchy"),
  public: prop(
    "public",
    "boolean",
    "Whether this hierarchy is visible to API consumers"
  ),
  levels: prop(
    "levels",
    "function",
    "Ordered list of dimension references forming the hierarchy levels",
    { required: true }
  ),
};

// ---------------------------------------------------------------------------
// Cube Top-Level Properties
// ---------------------------------------------------------------------------

const cubeProperties: Record<string, PropertySpec> = {
  name: prop("name", "string", "Unique identifier for this cube", {
    required: true,
  }),
  sql: prop(
    "sql",
    "sql",
    "Base SQL query for this cube (mutually exclusive with sqlTable)"
  ),
  sqlTable: withYamlKey(
    prop(
      "sqlTable",
      "sql",
      "Table name for this cube (mutually exclusive with sql)"
    ),
    "sql_table"
  ),
  title: prop("title", "string", "Display title for this cube"),
  sqlAlias: withYamlKey(
    prop(
      "sqlAlias",
      "string",
      "Custom SQL alias used when referencing this cube in queries"
    ),
    "sql_alias"
  ),
  dataSource: withYamlKey(
    prop("dataSource", "string", "Data source name for multi-database setups"),
    "data_source"
  ),
  description: prop(
    "description",
    "string",
    "Description of this cube (shown in documentation)"
  ),
  extends: prop(
    "extends",
    "function",
    "Reference to a parent cube to inherit from"
  ),
  refreshKey: withYamlKey(
    prop(
      "refreshKey",
      "object",
      "Refresh key configuration controlling data cache invalidation",
      {
        children: cubeRefreshKeyProperties,
      }
    ),
    "refresh_key"
  ),
  rewriteQueries: withYamlKey(
    prop(
      "rewriteQueries",
      "boolean",
      "Enable query rewriting to use pre-aggregations"
    ),
    "rewrite_queries"
  ),
  shown: prop("shown", "boolean", "Whether to show this cube in the UI", {
    deprecated: true,
    deprecatedBy: "public",
  }),
  public: prop(
    "public",
    "boolean",
    "Whether this cube is visible to API consumers"
  ),
  meta: prop(
    "meta",
    "object",
    "Arbitrary metadata object (passed through to API responses)"
  ),
  fileName: withYamlKey(
    prop(
      "fileName",
      "string",
      "Internal file name reference (set automatically)"
    ),
    "file_name"
  ),
  // Member containers — these are structural, not simple properties
  joins: prop(
    "joins",
    "object",
    "Join definitions connecting this cube to other cubes"
  ),
  measures: prop(
    "measures",
    "object",
    "Measure definitions (aggregated values)"
  ),
  dimensions: prop(
    "dimensions",
    "object",
    "Dimension definitions (columns/attributes)"
  ),
  segments: prop(
    "segments",
    "object",
    "Segment definitions (reusable filter conditions)"
  ),
  preAggregations: withYamlKey(
    prop(
      "preAggregations",
      "object",
      "Pre-aggregation definitions for query acceleration"
    ),
    "pre_aggregations"
  ),
  accessPolicy: withYamlKey(
    prop(
      "accessPolicy",
      "array",
      "Access policy rules for role-based security",
      {
        children: accessPolicyProperties,
      }
    ),
    "access_policy"
  ),
  hierarchies: prop(
    "hierarchies",
    "object",
    "Hierarchy definitions for dimension drill-paths",
    {
      children: hierarchyProperties,
    }
  ),
};

// ---------------------------------------------------------------------------
// View Properties
// ---------------------------------------------------------------------------

const viewProperties: Record<string, PropertySpec> = {
  name: prop("name", "string", "Unique identifier for this view", {
    required: true,
  }),
  title: prop("title", "string", "Display title for this view"),
  description: prop(
    "description",
    "string",
    "Description of this view (shown in documentation)"
  ),
  public: prop(
    "public",
    "boolean",
    "Whether this view is visible to API consumers"
  ),
  shown: prop("shown", "boolean", "Whether to show this view in the UI", {
    deprecated: true,
    deprecatedBy: "public",
  }),
  meta: prop(
    "meta",
    "object",
    "Arbitrary metadata object (passed through to API responses)"
  ),
  isView: withYamlKey(
    prop(
      "isView",
      "boolean",
      "Marks this construct as a view (internal, set automatically)"
    ),
    "is_view"
  ),
  fileName: withYamlKey(
    prop(
      "fileName",
      "string",
      "Internal file name reference (set automatically)"
    ),
    "file_name"
  ),
  extends: prop(
    "extends",
    "function",
    "Reference to a parent view to inherit from"
  ),
  sqlAlias: withYamlKey(
    prop("sqlAlias", "string", "Custom SQL alias for this view"),
    "sql_alias"
  ),
  cubes: prop(
    "cubes",
    "array",
    "Cube references and member selections for this view",
    {
      children: viewCubeItemProperties,
    }
  ),
  folders: prop(
    "folders",
    "array",
    "Folder definitions for organizing view members",
    {
      children: viewFolderItemProperties,
    }
  ),
  // Views can also define joins, measures, dimensions, segments, preAggregations
  joins: prop(
    "joins",
    "object",
    "Join definitions (inherited from base schema)"
  ),
  measures: prop("measures", "object", "Measure definitions"),
  dimensions: prop("dimensions", "object", "Dimension definitions"),
  segments: prop("segments", "object", "Segment definitions"),
  preAggregations: withYamlKey(
    prop("preAggregations", "object", "Pre-aggregation definitions"),
    "pre_aggregations"
  ),
  accessPolicy: withYamlKey(
    prop(
      "accessPolicy",
      "array",
      "Access policy rules for role-based security",
      {
        children: accessPolicyProperties,
      }
    ),
    "access_policy"
  ),
  hierarchies: prop("hierarchies", "object", "Hierarchy definitions", {
    children: hierarchyProperties,
  }),
  refreshKey: withYamlKey(
    prop("refreshKey", "object", "Refresh key configuration", {
      children: cubeRefreshKeyProperties,
    }),
    "refresh_key"
  ),
  dataSource: withYamlKey(
    prop("dataSource", "string", "Data source name for multi-database setups"),
    "data_source"
  ),
  rewriteQueries: withYamlKey(
    prop(
      "rewriteQueries",
      "boolean",
      "Enable query rewriting to use pre-aggregations"
    ),
    "rewrite_queries"
  ),
};

// ---------------------------------------------------------------------------
// Template Variables
// ---------------------------------------------------------------------------

const templateVariables: TemplateVariableSpec[] = [
  {
    name: "CUBE",
    description:
      "References the current cube. Use in sql expressions to self-reference columns.",
    snippet: "CUBE",
  },
  {
    name: "FILTER_PARAMS",
    description:
      "Access filter parameters passed to the query. Used for partition pruning and dynamic SQL.",
    methods: ["filter"],
    snippet:
      "FILTER_PARAMS.${1:CubeName}.${2:memberName}.filter(${3:(from, to) => `col >= ${from} AND col <= ${to}`})",
  },
  {
    name: "SECURITY_CONTEXT",
    description:
      "Access security context values set during authentication. Use for row-level security.",
    methods: ["unsafeValue"],
    snippet: "SECURITY_CONTEXT.${1:key}.unsafeValue()",
  },
  {
    name: "SQL_UTILS",
    description: "SQL utility functions for cross-database compatibility.",
    methods: ["convertTz"],
    snippet: "SQL_UTILS.convertTz(${1:'column'})",
  },
  {
    name: "COMPILE_CONTEXT",
    description:
      "Access compile-time context including security context values.",
    snippet: "COMPILE_CONTEXT.securityContext.${1:key}",
  },
];

// ---------------------------------------------------------------------------
// Member Type Specs
// ---------------------------------------------------------------------------

const dimensionTypeSpec: MemberTypeSpec = {
  name: "dimensions",
  properties: dimensionProperties,
  typeValues: ["string", "number", "boolean", "time", "geo"],
};

const measureTypeSpec: MemberTypeSpec = {
  name: "measures",
  properties: measureProperties,
  typeValues: measureTypesMultiStage,
};

const joinTypeSpec: MemberTypeSpec = {
  name: "joins",
  properties: joinProperties,
  typeValues: relationshipValues,
};

const segmentTypeSpec: MemberTypeSpec = {
  name: "segments",
  properties: segmentProperties,
  typeValues: [],
};

const preAggregationTypeSpec: MemberTypeSpec = {
  name: "preAggregations",
  properties: preAggregationProperties,
  typeValues: [
    "rollup",
    "originalSql",
    "rollupJoin",
    "rollupLambda",
    "autoRollup",
  ],
};

const hierarchyTypeSpec: MemberTypeSpec = {
  name: "hierarchies",
  properties: hierarchyProperties,
  typeValues: [],
};

// ---------------------------------------------------------------------------
// Construct Specs
// ---------------------------------------------------------------------------

const cubeConstruct: ConstructSpec = {
  name: "cube",
  properties: cubeProperties,
  memberTypes: {
    dimensions: dimensionTypeSpec,
    measures: measureTypeSpec,
    joins: joinTypeSpec,
    segments: segmentTypeSpec,
    preAggregations: preAggregationTypeSpec,
    hierarchies: hierarchyTypeSpec,
  },
};

const viewConstruct: ConstructSpec = {
  name: "view",
  properties: viewProperties,
  memberTypes: {
    dimensions: dimensionTypeSpec,
    measures: measureTypeSpec,
    joins: joinTypeSpec,
    segments: segmentTypeSpec,
    preAggregations: preAggregationTypeSpec,
    hierarchies: hierarchyTypeSpec,
  },
};

// ---------------------------------------------------------------------------
// Full Schema Spec
// ---------------------------------------------------------------------------

export const cubeJsSpec: SchemaSpec = {
  version: CUBEJS_SPEC_VERSION,
  constructs: {
    cube: cubeConstruct,
    view: viewConstruct,
  },
  templateVariables,
};

// ---------------------------------------------------------------------------
// Utility: get the key for a given format
// ---------------------------------------------------------------------------

/**
 * Returns the appropriate property key for the specified format.
 * YAML uses snake_case, JavaScript uses camelCase.
 */
export function getKeyForFormat(
  spec: PropertySpec,
  format: "yaml" | "js"
): string {
  return format === "yaml" ? spec.yamlKey : spec.jsKey;
}
