import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Alert,
  Checkbox,
  Input as AntInput,
  Progress,
  Radio,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import AuthTokensStore from "@/stores/AuthTokensStore";
import type { DataSourceInfo, Schema } from "@/types/dataSource";
import {
  useSmartGenDataSchemasMutation,
  useFetchMetaQuery,
} from "@/graphql/generated";

import FilterBuilder from "./FilterBuilder";

import styles from "./index.module.less";

import type { FilterCondition, DimensionMap } from "./FilterBuilder";
import type { FC } from "react";

const { Title, Text } = Typography;

// ---------------------------------------------------------------------------
// Phase labels for the profiler SSE events
// ---------------------------------------------------------------------------

const PHASE_LABELS: Record<string, string> = {
  init: "Schema Discovery",
  metadata: "Schema Discovery",
  schema_analysis: "Schema Discovery",
  initial_profile: "Initial Profile",
  profiling: "Deep Profiling",
  map_stats: "Map Key Stats",
  lc_probe: "Value Enumeration",
};

interface ProgressEvent {
  step: string;
  message: string;
  progress: number;
  detail?: Record<string, unknown>;
}

/** Format milliseconds into a human-readable duration. */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins}m`;
}

/** Real-time profile progress from SSE events. */
const ProfileProgress: FC<{
  events: ProgressEvent[];
  onCancel?: () => void;
}> = ({ events, onCancel }) => {
  const latest = events[events.length - 1];
  const phaseLabel = latest ? PHASE_LABELS[latest.step] : null;
  const percent = latest ? Math.round(latest.progress * 100) : 2;

  const stepNum = (latest?.detail?.step as number) || 0;
  const totalSteps = (latest?.detail?.total_steps as number) || 0;
  const elapsedMs = (latest?.detail?.elapsed_ms as number) || 0;
  const etaMs = (latest?.detail?.eta_ms as number) || null;

  return (
    <div className={styles.progressSection}>
      <Spin spinning>
        <div className={styles.progressPhase}>
          <span className={styles.progressPhaseLabel}>
            {phaseLabel || "Connecting..."}
          </span>
          {totalSteps > 0 && (
            <span className={styles.progressStepCount}>
              {stepNum}/{totalSteps}
            </span>
          )}
        </div>
        <div className={styles.progressStep}>
          {latest?.message || "Starting profiler..."}
        </div>
        <Progress percent={percent} status="active" showInfo={false} />
        <div className={styles.progressMeta}>
          {elapsedMs > 0 && (
            <span className={styles.progressElapsed}>
              {formatDuration(elapsedMs)} elapsed
            </span>
          )}
          {etaMs != null && etaMs > 0 && (
            <span className={styles.progressEta}>
              ~{formatDuration(etaMs)} remaining
            </span>
          )}
        </div>
        {events.length > 1 && (
          <div className={styles.progressLog}>
            {events.slice(-4, -1).map((e, i) => (
              <div key={i} className={styles.progressLogItem}>
                {e.message}
              </div>
            ))}
          </div>
        )}
      </Spin>
      {onCancel && (
        <Button size="small" style={{ marginTop: 12 }} onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};

/** Simulated progress for non-SSE steps (dry-run, apply). */
const SimulatedProgress: FC<{
  messages: string[];
  maxPercent?: number;
  intervalMs?: number;
}> = ({ messages, maxPercent = 95, intervalMs = 1500 }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [percent, setPercent] = useState(5);

  useEffect(() => {
    const step = Math.floor(maxPercent / messages.length);
    const timer = setInterval(() => {
      setMsgIdx((prev) => Math.min(prev + 1, messages.length - 1));
      setPercent((prev) => Math.min(prev + step, maxPercent));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [messages.length, maxPercent, intervalMs]);

  return (
    <div className={styles.progressSection}>
      <Spin spinning>
        <div className={styles.progressStep}>{messages[msgIdx]}</div>
        <Progress percent={percent} status="active" showInfo={false} />
      </Spin>
    </div>
  );
};

// -- Change preview types --

interface ChangeField {
  name: string;
  type?: string;
  member_type: string;
  cube: string;
  reason?: string;
  source?: "map" | "nested" | "ai";
}

interface ChangeBlock {
  block: string;
  cube: string;
}

interface AIMetricEntry {
  name: string;
  type: string;
  member_type: string;
  cube: string;
  ai_generation_context: string | null;
}

interface ChangePreview {
  fields_added: ChangeField[];
  fields_updated: ChangeField[];
  fields_removed: ChangeField[];
  fields_preserved: ChangeField[];
  blocks_preserved: ChangeBlock[];
  summary: string;
  ai_metrics_added?: AIMetricEntry[];
  ai_metrics_retained?: AIMetricEntry[];
  ai_metrics_removed?: AIMetricEntry[];
}

/** Render the change preview as categorized tables. */
const ChangePreviewPanel: FC<{ preview: ChangePreview }> = ({ preview }) => {
  const columns = [
    { title: "Field", dataIndex: "name", key: "name" },
    {
      title: "Type",
      dataIndex: "member_type",
      key: "member_type",
      render: (v: string) => (
        <Tag color={v === "dimension" ? "blue" : "green"}>{v}</Tag>
      ),
    },
    {
      title: "Cube Type",
      dataIndex: "type",
      key: "type",
      render: (v: string) => v || "—",
    },
    { title: "Cube", dataIndex: "cube", key: "cube" },
  ];

  const preservedColumns = [
    { title: "Field", dataIndex: "name", key: "name" },
    {
      title: "Type",
      dataIndex: "member_type",
      key: "member_type",
      render: (v: string) => (
        <Tag color={v === "dimension" ? "blue" : "green"}>{v}</Tag>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (v: string) => {
        switch (v) {
          case "user_created":
            return <Tag color="purple">User-created</Tag>;
          case "edited_description":
            return <Tag color="orange">Edited description</Tag>;
          default:
            return v;
        }
      },
    },
    { title: "Cube", dataIndex: "cube", key: "cube" },
  ];

  const aiAdded = preview.ai_metrics_added ?? [];
  const aiRetained = preview.ai_metrics_retained ?? [];
  const aiRemoved = preview.ai_metrics_removed ?? [];
  const hasAIMetrics =
    aiAdded.length > 0 || aiRetained.length > 0 || aiRemoved.length > 0;

  // Filter out ai_generated fields from the preserved table — they're shown in the AI section
  const nonAIPreserved = preview.fields_preserved.filter(
    (f) => f.reason !== "ai_generated"
  );

  const hasChanges =
    preview.fields_added.length > 0 ||
    preview.fields_updated.length > 0 ||
    preview.fields_removed.length > 0;

  return (
    <div
      className={styles.changePreview}
      style={{ maxHeight: 400, overflowY: "auto" }}
    >
      <Title level={5}>Change Preview</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        {preview.summary}
      </Text>

      {preview.fields_added.length > 0 && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Tag color="success">+{preview.fields_added.length}</Tag>
            <Text strong>Fields to add</Text>
          </div>
          <Table
            size="small"
            dataSource={preview.fields_added}
            columns={columns}
            rowKey={(r) => `${r.cube}.${r.name}`}
            pagination={
              preview.fields_added.length > 10 ? { pageSize: 10 } : false
            }
          />
        </div>
      )}

      {preview.fields_updated.length > 0 && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Tag color="processing">~{preview.fields_updated.length}</Tag>
            <Text strong>Fields to update</Text>
          </div>
          <Table
            size="small"
            dataSource={preview.fields_updated}
            columns={columns}
            rowKey={(r) => `${r.cube}.${r.name}`}
            pagination={
              preview.fields_updated.length > 10 ? { pageSize: 10 } : false
            }
          />
        </div>
      )}

      {preview.fields_removed.length > 0 && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Tag color="error">-{preview.fields_removed.length}</Tag>
            <Text strong>Fields to remove</Text>
          </div>
          <Table
            size="small"
            dataSource={preview.fields_removed}
            columns={columns}
            rowKey={(r) => `${r.cube}.${r.name}`}
            pagination={
              preview.fields_removed.length > 10 ? { pageSize: 10 } : false
            }
          />
        </div>
      )}

      {nonAIPreserved.length > 0 && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Tag color="default">{nonAIPreserved.length}</Tag>
            <Text strong>User fields preserved</Text>
          </div>
          <Table
            size="small"
            dataSource={nonAIPreserved}
            columns={preservedColumns}
            rowKey={(r) => `${r.cube}.${r.name}`}
            pagination={nonAIPreserved.length > 10 ? { pageSize: 10 } : false}
          />
        </div>
      )}

      {preview.blocks_preserved.length > 0 && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Text strong>Blocks preserved</Text>
          </div>
          <Space>
            {preview.blocks_preserved.map((b) => (
              <Tag key={`${b.cube}.${b.block}`} color="purple">
                {b.block}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      {hasAIMetrics && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Text strong>AI-Generated Metrics</Text>
          </div>

          {aiAdded.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
                Added
              </Text>
              <Space size={4} wrap>
                {aiAdded.map((m) => (
                  <Tooltip
                    key={`${m.cube}.${m.name}`}
                    title={m.ai_generation_context || undefined}
                  >
                    <Tag color="success">
                      {m.cube}.{m.name}{" "}
                      <span style={{ opacity: 0.6 }}>({m.member_type})</span>
                    </Tag>
                  </Tooltip>
                ))}
              </Space>
            </div>
          )}

          {aiRetained.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
                Retained
              </Text>
              <Space size={4} wrap>
                {aiRetained.map((m) => (
                  <Tooltip
                    key={`${m.cube}.${m.name}`}
                    title={m.ai_generation_context || undefined}
                  >
                    <Tag color="default">
                      {m.cube}.{m.name}{" "}
                      <span style={{ opacity: 0.6 }}>({m.member_type})</span>
                    </Tag>
                  </Tooltip>
                ))}
              </Space>
            </div>
          )}

          {aiRemoved.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
                Removed
              </Text>
              <Space size={4} wrap>
                {aiRemoved.map((m) => (
                  <Tooltip
                    key={`${m.cube}.${m.name}`}
                    title={m.ai_generation_context || undefined}
                  >
                    <Tag color="error">
                      {m.cube}.{m.name}{" "}
                      <span style={{ opacity: 0.6 }}>({m.member_type})</span>
                    </Tag>
                  </Tooltip>
                ))}
              </Space>
            </div>
          )}
        </div>
      )}

      {!hasChanges &&
        !hasAIMetrics &&
        nonAIPreserved.length === 0 &&
        preview.blocks_preserved.length === 0 && (
          <Alert message="No changes detected" type="info" showIcon />
        )}
    </div>
  );
};

/** Top-level profile summary banner. */
const ProfileHero: FC<{
  table: string;
  schema: string;
  profileData: any;
}> = ({ table, schema, profileData }) => {
  const rows = profileData.row_count ?? 0;
  const allCols = profileData.columns?.filter(Boolean) ?? [];
  const cols = allCols.length;
  const activeCols = allCols.filter(
    (c: any) => c.has_values !== false && c.value_rows > 0
  ).length;
  const pks = profileData.primary_keys?.length ?? 0;
  const arrays = profileData.array_candidates?.length ?? 0;

  return (
    <div className={styles.profileHero}>
      <div className={styles.profileHeroHeader}>
        <Title level={4} className={styles.profileTableName}>
          {schema !== "no_schema" ? `${schema}.` : ""}
          {table}
        </Title>
        {profileData.sampled && (
          <span className={styles.profileSampled}>
            sampled {(profileData.sample_size ?? 0).toLocaleString()} rows
          </span>
        )}
      </div>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{rows.toLocaleString()}</span>
          <span className={styles.statLabel}>rows</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{cols}</span>
          <span className={styles.statLabel}>columns</span>
        </div>
        <div className={`${styles.stat} ${styles.statHighlight}`}>
          <span className={styles.statValue}>{activeCols}</span>
          <span className={styles.statLabel}>active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{pks}</span>
          <span className={styles.statLabel}>primary keys</span>
        </div>
        {arrays > 0 && (
          <div className={styles.stat}>
            <span className={styles.statValue}>{arrays}</span>
            <span className={styles.statLabel}>arrays</span>
          </div>
        )}
      </div>
    </div>
  );
};

/** Expandable column detail row. */
const ColumnDetailPanel: FC<{ col: any }> = ({ col }) => {
  const lcVals: string[] = col.lc_values
    ? Array.isArray(col.lc_values)
      ? col.lc_values
      : Object.keys(col.lc_values)
    : [];

  return (
    <div className={styles.columnDetails}>
      <div className={styles.detailGrid}>
        {col.value_rows != null && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Non-null</span>
            <span className={styles.detailValue}>
              {Number(col.value_rows).toLocaleString()}
            </span>
          </div>
        )}
        {col.unique_values != null && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Unique</span>
            <span className={styles.detailValue}>
              {Number(col.unique_values).toLocaleString()}
            </span>
          </div>
        )}
        {col.min_value != null && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Min</span>
            <span className={styles.detailValue}>{col.min_value}</span>
          </div>
        )}
        {col.max_value != null && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Max</span>
            <span className={styles.detailValue}>{col.max_value}</span>
          </div>
        )}
        {col.avg_value != null && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Avg</span>
            <span className={styles.detailValue}>
              {Number(col.avg_value).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
        {col.max_array_length != null && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Max array len</span>
            <span className={styles.detailValue}>{col.max_array_length}</span>
          </div>
        )}
        {col.description && (
          <div className={styles.detailDescription}>{col.description}</div>
        )}
        {lcVals.length > 0 && (
          <div className={styles.detailValues}>
            <span className={styles.detailLabel}>Values</span>
            <div className={styles.detailValueTags}>
              {lcVals.map((v) => (
                <Tag key={v} style={{ margin: 0 }}>
                  {v}
                </Tag>
              ))}
            </div>
          </div>
        )}
        {col.unique_keys && col.unique_keys.length > 0 && (
          <div className={styles.detailValues}>
            <span className={styles.detailLabel}>Map keys</span>
            <div className={styles.detailValueTags}>
              {col.unique_keys.map((k: string) => (
                <Tag key={k} color="blue" style={{ margin: 0 }}>
                  {k}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Format large numbers compactly: 1234 → "1.2K", 1234567 → "1.2M" */
function compactNum(n: number | null | undefined): string {
  if (n == null) return "—";
  const v = Number(n);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
}

/** Get inline info text: description, LC value preview, or range hint */
function getColumnInfo(col: any): { text?: string; tags?: string[] } {
  // Show LC values as inline tags (most useful at-a-glance info)
  const lcVals: string[] = col.lc_values
    ? Array.isArray(col.lc_values)
      ? col.lc_values
      : Object.keys(col.lc_values)
    : [];
  if (lcVals.length > 0) {
    return { tags: lcVals.slice(0, 5) };
  }
  // Show description if available
  if (col.description) {
    return { text: col.description };
  }
  // Show range for numeric columns
  if (col.min_value != null && col.max_value != null) {
    return { text: `${col.min_value} … ${col.max_value}` };
  }
  // Show map key count
  if (col.unique_keys?.length > 0) {
    return { text: `${col.unique_keys.length} map keys` };
  }
  return {};
}

type ColumnFilter = "all" | "active" | "empty";

/** Infinite-scroll column list with activity indicators and inline stats. */
const ColumnList: FC<{
  columns: any[];
  rowCount: number;
  selectedColumns?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}> = ({ columns, rowCount, selectedColumns, onSelectionChange }) => {
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ColumnFilter>("all");
  const selectable = !!onSelectionChange;

  const activeCount = useMemo(
    () =>
      columns.filter((c) => c.has_values !== false && c.value_rows > 0).length,
    [columns]
  );
  const emptyCount = columns.length - activeCount;

  const filtered = useMemo(() => {
    let result = columns;

    // Activity filter
    if (filter === "active") {
      result = result.filter((c) => c.has_values !== false && c.value_rows > 0);
    } else if (filter === "empty") {
      result = result.filter(
        (c) => c.has_values === false || !(c.value_rows > 0)
      );
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.raw_type && c.raw_type.toLowerCase().includes(q))
      );
    }

    return result;
  }, [columns, search, filter]);

  return (
    <div className={styles.columnListSection}>
      <div className={styles.columnFilterTabs}>
        {(["all", "active", "empty"] as ColumnFilter[]).map((f) => (
          <span
            key={f}
            className={`${styles.columnFilterTab} ${
              filter === f ? styles.columnFilterTabActive : ""
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? `All (${columns.length})`
              : f === "active"
              ? `Active (${activeCount})`
              : `Empty (${emptyCount})`}
          </span>
        ))}
        <AntInput
          placeholder="Filter columns..."
          size="small"
          allowClear
          className={styles.columnSearchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.columnScroll}>
        <div className={styles.columnItemHeader}>
          {selectable && (
            <Checkbox
              checked={
                selectedColumns != null &&
                filtered
                  .filter((c) => c.has_values !== false && c.value_rows > 0)
                  .every((c) => selectedColumns.has(c.name))
              }
              indeterminate={
                selectedColumns != null &&
                filtered.some((c) => selectedColumns.has(c.name)) &&
                !filtered
                  .filter((c) => c.has_values !== false && c.value_rows > 0)
                  .every((c) => selectedColumns.has(c.name))
              }
              onChange={(e) => {
                if (!onSelectionChange || !selectedColumns) return;
                const next = new Set(selectedColumns);
                const activeFiltered = filtered.filter(
                  (c) => c.has_values !== false && c.value_rows > 0
                );
                if (e.target.checked) {
                  activeFiltered.forEach((c) => next.add(c.name));
                } else {
                  activeFiltered.forEach((c) => next.delete(c.name));
                }
                onSelectionChange(next);
              }}
            />
          )}
          <span />
          <span />
          <span>Name</span>
          <span>Type</span>
          <span>Fill</span>
          <span>Unique</span>
          <span>Info</span>
        </div>
        {filtered.map((col) => {
          const isOpen = expandedCol === col.name;
          const isActive = col.has_values !== false && col.value_rows > 0;
          const fillPct =
            rowCount > 0 && col.value_rows != null
              ? Math.round((Number(col.value_rows) / rowCount) * 100)
              : isActive
              ? 100
              : 0;
          const info = getColumnInfo(col);

          return (
            <div key={col.name}>
              <div
                className={`${styles.columnItem} ${
                  isOpen ? styles.columnItemExpanded : ""
                } ${!isActive ? styles.columnItemInactive : ""}`}
                onClick={() => setExpandedCol(isOpen ? null : col.name)}
              >
                {selectable && (
                  <Checkbox
                    checked={selectedColumns?.has(col.name) ?? false}
                    disabled={!isActive}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (!onSelectionChange || !selectedColumns) return;
                      const next = new Set(selectedColumns);
                      if (e.target.checked) {
                        next.add(col.name);
                      } else {
                        next.delete(col.name);
                      }
                      onSelectionChange(next);
                    }}
                  />
                )}
                <RightOutlined
                  className={`${styles.columnChevron} ${
                    isOpen ? styles.columnChevronOpen : ""
                  }`}
                />
                <span
                  className={`${styles.columnStatusDot} ${
                    isActive
                      ? styles.columnStatusActive
                      : styles.columnStatusEmpty
                  }`}
                />
                <span className={styles.columnName}>{col.name}</span>
                <span className={styles.columnType}>
                  <span>{col.raw_type}</span>
                </span>
                <span className={styles.columnFill}>
                  <span className={styles.fillBar}>
                    <span
                      className={`${styles.fillBarInner} ${
                        fillPct === 0
                          ? styles.fillBarEmpty
                          : fillPct < 50
                          ? styles.fillBarLow
                          : ""
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </span>
                  <span className={styles.fillPercent}>{fillPct}%</span>
                </span>
                <span className={styles.columnUnique}>
                  {col.unique_values != null
                    ? compactNum(col.unique_values)
                    : "—"}
                </span>
                <span className={styles.columnInfo}>
                  {info.tags ? (
                    <span className={styles.columnInfoTags}>
                      {info.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                  ) : info.text ? (
                    <span className={styles.columnInfoText}>{info.text}</span>
                  ) : null}
                </span>
              </div>
              {isOpen && <ColumnDetailPanel col={col} />}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div
            style={{
              padding: "16px 14px",
              color: "var(--color-dimgray-300)",
              fontSize: 13,
            }}
          >
            No columns match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};

type SmartGenStep =
  | "select"
  | "profiling"
  | "preview"
  | "previewing_changes"
  | "change_preview"
  | "applying"
  | "done";

interface ArrayJoinSelection {
  column: string;
  alias: string;
  selected: boolean;
}

interface SmartGenerationProps {
  dataSource: DataSourceInfo;
  schema: Schema | undefined;
  branchId: string;
  onComplete: () => void;
  onCancel: () => void;
  /** Pre-selected table schema (e.g. "cst") from model provenance — skips table selection */
  initialSchema?: string;
  /** Pre-selected table name (e.g. "semantic_events") from model provenance — skips table selection */
  initialTable?: string;
  /** Filters from previous generation (pre-populated on reprofile) */
  previousFilters?: FilterCondition[];
}

const SmartGeneration: FC<SmartGenerationProps> = ({
  dataSource,
  schema,
  branchId,
  onComplete,
  onCancel,
  initialSchema,
  initialTable,
  previousFilters,
}) => {
  const { t } = useTranslation(["models", "common"]);
  const hasInitial = !!(initialSchema && initialTable);
  const [step, setStep] = useState<SmartGenStep>("select");
  const [filters, setFilters] = useState<FilterCondition[]>(
    previousFilters || []
  );
  const [selectedSchema, setSelectedSchema] = useState<string>(
    initialSchema || ""
  );
  const [selectedTable, setSelectedTable] = useState<string>(
    initialTable || ""
  );
  const [mergeStrategy, setMergeStrategy] = useState<string>("auto");
  const [fileNameOverride, setFileNameOverride] = useState<string>("");
  const [cubeNameOverride, setCubeNameOverride] = useState<string>("");
  const [arrayJoinSelections, setArrayJoinSelections] = useState<
    ArrayJoinSelection[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [rawProfile, setRawProfile] = useState<any>(null);
  const [changePreview, setChangePreview] = useState<ChangePreview | null>(
    null
  );
  const [suggestedAIMetrics, setSuggestedAIMetrics] = useState<any[]>([]);
  const [selectedAIMetricNames, setSelectedAIMetricNames] = useState<
    Set<string>
  >(new Set());
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set()
  );

  const [selectedModelFields, setSelectedModelFields] = useState<Set<string>>(
    new Set()
  );
  const [profileData, setProfileData] = useState<any>(null);
  const [skipLlm, setSkipLlm] = useState(false);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const [smartGenResult, execSmartGen] = useSmartGenDataSchemasMutation();

  // Fetch Cube.js meta — same query the Explore page uses.
  // pause=false when both datasource + branch are available (mirrors Explore page pattern).
  const [metaResult, execMetaQuery] = useFetchMetaQuery({
    variables: { datasource_id: dataSource.id!, branch_id: branchId },
    pause: !dataSource.id || !branchId,
  });

  // Re-fetch meta when datasource or branch changes
  useEffect(() => {
    if (dataSource.id && branchId) {
      execMetaQuery();
    }
  }, [dataSource.id, branchId, execMetaQuery]);

  // Build dimension map: raw ClickHouse column name → fully-qualified Cube.js
  // dimension member (e.g. "event" → "semantic_events.event").
  //
  // Three matching strategies, in priority order:
  //  1. dim.meta.source_column === rawColumn  (direct, set by our cubeBuilder)
  //  2. dim short name === rawColumn          (exact, works for simple columns)
  //  3. dim short name === sanitized(rawColumn) (handles special chars)
  const dimensionMap = useMemo<DimensionMap | undefined>(() => {
    const cubes = metaResult.data?.fetch_meta?.cubes as any[] | undefined;
    if (!cubes || cubes.length === 0) return undefined;

    // Collect ALL dimensions across all cubes, indexed by short name and source_column
    const bySourceCol: Record<string, string> = {};
    const byShortName: Record<string, string> = {};

    for (const cube of cubes) {
      for (const dim of cube.dimensions || []) {
        if (!dim.name) continue;
        const fullName: string = dim.name; // "cubeName.dimName"

        // Strategy 1: meta.source_column
        const sc = dim.meta?.source_column;
        if (sc && typeof sc === "string") {
          bySourceCol[sc] = fullName;
        }

        // Index by short name for strategies 2 & 3
        const dot = fullName.lastIndexOf(".");
        const shortName = dot >= 0 ? fullName.slice(dot + 1) : fullName;
        byShortName[shortName] = fullName;
      }
    }

    // Now map each raw column from the table schema
    const tableColumns = schema?.[selectedSchema]?.[selectedTable] || [];
    if (tableColumns.length === 0) return undefined;

    const map: DimensionMap = {};
    for (const col of tableColumns) {
      const raw = col.name;

      // Strategy 1: exact source_column match
      if (bySourceCol[raw]) {
        map[raw] = bySourceCol[raw];
        continue;
      }

      // Strategy 2: exact short-name match
      if (byShortName[raw]) {
        map[raw] = byShortName[raw];
        continue;
      }

      // Strategy 3: sanitized match
      let sanitized = raw.replace(/[^a-zA-Z0-9_]/g, "_");
      if (/^\d/.test(sanitized)) sanitized = `field_${sanitized}`;
      sanitized = sanitized.replace(/_+/g, "_").replace(/^_+|_+$/g, "");
      if (sanitized && byShortName[sanitized]) {
        map[raw] = byShortName[sanitized];
      }
    }

    if (Object.keys(map).length > 0) {
      console.debug("[FilterBuilder] dimensionMap built:", map);
      return map;
    }
    console.debug(
      "[FilterBuilder] no dimension map — meta cubes:",
      cubes?.length,
      "tableColumns:",
      tableColumns.length,
      "byShortName keys:",
      Object.keys(byShortName).slice(0, 5),
      "bySourceCol keys:",
      Object.keys(bySourceCol).slice(0, 5)
    );
    return undefined;
  }, [metaResult.data, selectedSchema, selectedTable, schema]);

  /** Profile a table via direct SSE to CubeJS — bypasses Hasura for real-time progress. */
  const startProfile = useCallback(
    (tblSchema: string, tblName: string) => {
      // Abort any in-flight profile
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStep("profiling");
      setError(null);
      setRawProfile(null);
      setChangePreview(null);
      setProfileData(null);
      setProgressEvents([]);

      const token =
        AuthTokensStore.getState().workosAccessToken ||
        AuthTokensStore.getState().accessToken;

      fetch("/api/v1/profile-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-hasura-datasource-id": dataSource.id!,
          "x-hasura-branch-id": branchId,
        },
        body: JSON.stringify({
          table: tblName,
          schema: tblSchema,
          branchId,
          ...(filters.length > 0 ? { filters } : {}),
        }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.message || `Profile failed (${res.status})`);
          }

          const reader = res.body?.getReader();
          if (!reader) throw new Error("No response stream");

          const decoder = new TextDecoder();
          let buffer = "";
          // SSE event accumulator — handles data split across chunks
          let sseEvent = "";
          let sseData = "";

          const handleSseEvent = (eventType: string, dataStr: string) => {
            let data: any;
            try {
              data = JSON.parse(dataStr);
            } catch {
              return; // incomplete or malformed JSON
            }

            if (eventType === "progress") {
              setProgressEvents((prev) => [...prev, data as ProgressEvent]);
            } else if (eventType === "complete") {
              const pd = data;
              setProfileData(pd);
              if (pd.existing_model?.suggested_merge_strategy) {
                setMergeStrategy(pd.existing_model.suggested_merge_strategy);
              }
              if (pd.raw_profile) {
                setRawProfile(pd.raw_profile);
              }
              if (pd.array_candidates?.length) {
                setArrayJoinSelections(
                  pd.array_candidates.filter(Boolean).map((c: any) => ({
                    column: c.column,
                    alias: c.suggested_alias,
                    selected: false,
                  }))
                );
              }
              // Select all active columns by default
              if (pd.columns?.length) {
                const active = pd.columns
                  .filter(
                    (c: any) => c.has_values !== false && c.value_rows > 0
                  )
                  .map((c: any) => c.name);
                setSelectedColumns(new Set(active));
              }
              setStep("preview");
            } else if (eventType === "error") {
              setError(data.error || "Profiling failed");
              setStep("select");
            }
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line === "") {
                // Blank line = end of SSE event block
                if (sseEvent && sseData) {
                  handleSseEvent(sseEvent, sseData);
                }
                sseEvent = "";
                sseData = "";
              } else if (line.startsWith("event: ")) {
                sseEvent = line.slice(7).trim();
              } else if (line.startsWith("data: ")) {
                sseData += line.slice(6);
              } else if (sseData) {
                // Continuation of a data line split across chunks
                sseData += line;
              }
            }
          }
          // Handle final event if stream ends without trailing blank line
          if (sseEvent && sseData) {
            handleSseEvent(sseEvent, sseData);
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") return; // cancelled by user
          setError(err.message || "Profiling failed");
          setStep("select");
        });
    },
    [dataSource.id, branchId, filters]
  );

  // Sync late-arriving initial selection (e.g. after page refresh).
  // Initial table/schema can be resolved by parent after this component mounts.
  useEffect(() => {
    const tableExistsInSchema =
      !!initialSchema &&
      !!initialTable &&
      !!schema?.[initialSchema]?.[initialTable];

    if (tableExistsInSchema) {
      setSelectedSchema(initialSchema);
      setSelectedTable(initialTable);
      setStep("select");
      setError(null);

      // Pre-populate filters from previous generation when reprofiling.
      if (previousFilters && previousFilters.length > 0) {
        setFilters(previousFilters);
      }
    }
  }, [initialSchema, initialTable, previousFilters, schema]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const tableOptions = useMemo(() => {
    if (!schema) return [];
    const options: { label: string; value: string }[] = [];
    for (const [schemaName, tables] of Object.entries(schema)) {
      for (const tableName of Object.keys(tables)) {
        options.push({
          label:
            schemaName === "no_schema"
              ? tableName
              : `${schemaName}.${tableName}`,
          value: `${schemaName}::${tableName}`,
        });
      }
    }
    return options;
  }, [schema]);

  const isTableOptionsLoading = !schema || tableOptions.length === 0;

  const selectedTableValue = useMemo(() => {
    if (!selectedSchema || !selectedTable) return undefined;
    const value = `${selectedSchema}::${selectedTable}`;
    return tableOptions.some((option) => option.value === value)
      ? value
      : undefined;
  }, [selectedSchema, selectedTable, tableOptions]);

  const handleTableSelect = useCallback((value: string) => {
    const [schemaName, tableName] = value.split("::");
    setSelectedSchema(schemaName);
    setSelectedTable(tableName);
    setFilters([]);
    setError(null);
  }, []);

  const handleProfile = useCallback(() => {
    if (!selectedTable || !selectedSchema) return;
    startProfile(selectedSchema, selectedTable);
  }, [selectedTable, selectedSchema, startProfile]);

  // Preview changes (dry-run) — no ClickHouse query, uses cached profile
  const handlePreviewChanges = useCallback(async () => {
    setStep("previewing_changes");
    setError(null);

    const selectedArrayJoins = arrayJoinSelections
      .filter((a) => a.selected)
      .map((a) => ({ column: a.column, alias: a.alias }));

    // Only pass selected_columns if user deselected some columns
    const activeCount =
      profileData?.columns?.filter(
        (c: any) => c.has_values !== false && c.value_rows > 0
      ).length ?? 0;
    const isSubset = selectedColumns.size < activeCount;

    const result = await execSmartGen({
      datasource_id: dataSource.id!,
      branch_id: branchId,
      table_name: selectedTable,
      table_schema: selectedSchema,
      merge_strategy: mergeStrategy,
      array_join_columns: selectedArrayJoins.length
        ? selectedArrayJoins
        : undefined,
      profile_data: rawProfile || undefined,
      dry_run: true,
      filters: filters.length > 0 ? filters : undefined,
      file_name: fileNameOverride || undefined,
      cube_name: cubeNameOverride || undefined,
      selected_columns: isSubset ? [...selectedColumns] : undefined,
      skip_llm: skipLlm || undefined,
    } as any);

    if (result.error) {
      setError(result.error.message);
      setStep("preview");
      return;
    }

    const genData = result.data?.smart_gen_dataschemas;
    const preview = genData?.change_preview;
    if (preview) {
      setChangePreview(preview as ChangePreview);

      // Required fields: rewrite rule dimensions + filter dimensions (always included)
      const requiredSet = new Set<string>(genData?.required_fields || []);

      // Default selection rules:
      //   ALWAYS checked: count measure, required fields (rewrite rules + filters)
      //   Checked by default: regular columns (no source tag)
      //   Unchecked (opt-in): map fields, nested fields, AI-generated fields
      const isDefaultSelected = (f: any) => {
        const key = `${f.cube}.${f.name}`;
        // Always include required fields
        if (requiredSet.has(key)) return true;
        // Always include the count measure
        if (f.name === "count" && f.member_type === "measure") return true;
        // Opt-in sources: map, nested (ARRAY JOIN), AI-generated
        if (f.source === "map" || f.source === "nested" || f.source === "ai")
          return false;
        // Everything else checked by default
        return true;
      };

      const allKeys = [
        ...(preview.fields_added || [])
          .filter(isDefaultSelected)
          .map((f: any) => `${f.cube}.${f.name}`),
        ...(preview.fields_updated || [])
          .filter(isDefaultSelected)
          .map((f: any) => `${f.cube}.${f.name}`),
      ];
      setSelectedModelFields(new Set(allKeys));
    }

    // Capture AI metric suggestions from the LLM (if any)
    const aiSuggestions = genData?.ai_enrichment?.suggested_metrics || [];
    setSuggestedAIMetrics(aiSuggestions);
    // AI metrics are opt-in (unchecked by default)
    setSelectedAIMetricNames(new Set());

    setStep("change_preview");
  }, [
    dataSource.id,
    branchId,
    selectedTable,
    selectedSchema,
    mergeStrategy,
    arrayJoinSelections,
    rawProfile,
    filters,
    selectedColumns,
    profileData,
    execSmartGen,
  ]);

  // Apply changes (real mutation) — uses cached profile, no ClickHouse query
  const handleApply = useCallback(async () => {
    setStep("applying");
    setError(null);

    const selectedArrayJoins = arrayJoinSelections
      .filter((a) => a.selected)
      .map((a) => ({ column: a.column, alias: a.alias }));

    // Only pass selected_columns if user deselected some columns
    const applyActiveCount =
      profileData?.columns?.filter(
        (c: any) => c.has_values !== false && c.value_rows > 0
      ).length ?? 0;
    const applyIsSubset = selectedColumns.size < applyActiveCount;

    // Compute excluded fields: all preview fields NOT in the user's selection
    const allPreviewFields = [
      ...((changePreview?.fields_added || []) as ChangeField[]),
      ...((changePreview?.fields_updated || []) as ChangeField[]),
    ].map((f) => `${f.cube}.${f.name}`);
    const excludedFields = allPreviewFields.filter(
      (key) => !selectedModelFields.has(key)
    );

    const result = await execSmartGen({
      datasource_id: dataSource.id!,
      branch_id: branchId,
      table_name: selectedTable,
      table_schema: selectedSchema,
      merge_strategy: mergeStrategy,
      array_join_columns: selectedArrayJoins.length
        ? selectedArrayJoins
        : undefined,
      profile_data: rawProfile || undefined,
      dry_run: false,
      filters: filters.length > 0 ? filters : undefined,
      file_name: fileNameOverride || undefined,
      cube_name: cubeNameOverride || undefined,
      selected_ai_metrics: [...selectedAIMetricNames],
      selected_columns: applyIsSubset ? [...selectedColumns] : undefined,
      excluded_fields: excludedFields.length > 0 ? excludedFields : undefined,
      skip_llm: skipLlm || undefined,
    } as any);

    if (result.error) {
      setError(result.error.message);
      setStep("change_preview");
      return;
    }

    setStep("done");
  }, [
    dataSource.id,
    branchId,
    selectedTable,
    selectedSchema,
    mergeStrategy,
    arrayJoinSelections,
    rawProfile,
    filters,
    selectedAIMetricNames,
    selectedColumns,
    selectedModelFields,
    changePreview,
    profileData,
    execSmartGen,
  ]);

  const handleProfileCancel = useCallback(() => {
    abortRef.current?.abort();
    setError(null);
    setStep("select");
  }, []);

  const genData = smartGenResult.data?.smart_gen_dataschemas;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.dataSource}>
          <Title className={styles.title} level={3}>
            {dataSource.name}
          </Title>
        </div>
        <Text>
          Smart Generate analyzes your table structure and creates an optimized
          Cube.js data model with auto-detected dimensions, measures, and Map
          key expansion.
        </Text>
      </div>

      {/* Step 1: Table Selection */}
      {step === "select" && (
        <>
          <div className={styles.tableSelect}>
            <Title level={5}>Select a table</Title>
            <Select
              showSearch
              placeholder="Search for a table..."
              style={{ width: "100%" }}
              size="large"
              disabled={isTableOptionsLoading}
              loading={isTableOptionsLoading}
              value={selectedTableValue}
              onChange={handleTableSelect}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={tableOptions}
            />
          </div>

          {selectedTable && selectedSchema && schema && (
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Filters (optional)</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Add filters to profile a data subset instead of the entire
                table.
              </Text>
              <FilterBuilder
                schema={(() => {
                  const tableColumns =
                    schema?.[selectedSchema]?.[selectedTable] || [];
                  return tableColumns.map((col) => ({
                    name: col.name,
                    raw_type: col.type,
                    value_type: /int|float|decimal|double/i.test(col.type)
                      ? "NUMBER"
                      : /date|datetime/i.test(col.type)
                      ? "DATE"
                      : /bool/i.test(col.type)
                      ? "BOOLEAN"
                      : "STRING",
                  }));
                })()}
                filters={filters}
                onChange={setFilters}
                dimensionMap={dimensionMap}
                tableName={selectedTable}
                tableSchema={selectedSchema}
                datasourceId={dataSource.id!}
                branchId={branchId}
              />
            </div>
          )}

          {error && (
            <Alert
              className={styles.errorMessage}
              message={error}
              type="error"
              showIcon
            />
          )}

          <div className={styles.actions}>
            <Button size="large" onClick={onCancel}>
              {t("common:words.cancel")}
            </Button>
            <Button
              type="primary"
              size="large"
              disabled={!selectedTable}
              onClick={handleProfile}
            >
              Profile Table
            </Button>
          </div>
        </>
      )}

      {/* Step 2: Profiling in progress (real SSE progress) */}
      {step === "profiling" && (
        <ProfileProgress
          events={progressEvents}
          onCancel={handleProfileCancel}
        />
      )}

      {/* Step 3: Profile preview + options */}
      {step === "preview" && profileData && (
        <>
          <ProfileHero
            table={selectedTable}
            schema={selectedSchema}
            profileData={profileData}
          />

          {profileData.columns && profileData.columns.length > 0 && (
            <>
              <div style={{ marginBottom: 4, fontSize: 12, color: "#888" }}>
                {selectedColumns.size} of{" "}
                {
                  profileData.columns.filter(
                    (c: any) => c.has_values !== false && c.value_rows > 0
                  ).length
                }{" "}
                active columns selected for model
              </div>
              <ColumnList
                columns={profileData.columns.filter(Boolean) as any[]}
                rowCount={profileData.row_count ?? 0}
                selectedColumns={selectedColumns}
                onSelectionChange={setSelectedColumns}
              />
            </>
          )}

          {arrayJoinSelections.length > 0 && (
            <div style={{ margin: "16px 0" }}>
              <Title level={5}>Array Columns (ARRAY JOIN)</Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Select array columns to flatten into separate queryable cubes.
              </Text>
              <Space direction="vertical" style={{ width: "100%" }}>
                {arrayJoinSelections.map((aj, idx) => (
                  <div
                    key={aj.column}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Checkbox
                      checked={aj.selected}
                      onChange={(e) => {
                        const updated = [...arrayJoinSelections];
                        updated[idx] = {
                          ...updated[idx],
                          selected: e.target.checked,
                        };
                        setArrayJoinSelections(updated);
                      }}
                    >
                      {aj.column}
                    </Checkbox>
                    {aj.selected && (
                      <AntInput
                        size="small"
                        style={{ width: 200 }}
                        addonBefore="as"
                        value={aj.alias}
                        onChange={(e) => {
                          const updated = [...arrayJoinSelections];
                          updated[idx] = {
                            ...updated[idx],
                            alias: e.target.value,
                          };
                          setArrayJoinSelections(updated);
                        }}
                      />
                    )}
                  </div>
                ))}
              </Space>
            </div>
          )}

          {profileData.existing_model && (
            <div className={styles.mergeOptions}>
              <Text
                type="secondary"
                style={{ fontSize: 12, display: "block", marginBottom: 8 }}
              >
                Existing model:{" "}
                <Text code style={{ fontSize: 11 }}>
                  {profileData.existing_model.file_name}
                </Text>
                {profileData.existing_model.file_format === "js" && (
                  <> &mdash; JS file, YAML will coexist</>
                )}
              </Text>
              <Radio.Group
                size="small"
                value={mergeStrategy}
                onChange={(e) => setMergeStrategy(e.target.value)}
              >
                <Space direction="vertical" size={2}>
                  <Radio value="auto">
                    Auto ({profileData.existing_model.suggested_merge_strategy})
                  </Radio>
                  <Radio value="merge">Merge (preserve user content)</Radio>
                  <Radio value="replace">Replace (overwrite)</Radio>
                </Space>
              </Radio.Group>
            </div>
          )}

          <div style={{ margin: "16px 0" }}>
            <Title level={5}>Output Names</Title>
            <Space size={16}>
              <div>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 4, fontSize: 12 }}
                >
                  File name
                </Text>
                <AntInput
                  size="small"
                  style={{ width: 220 }}
                  placeholder={`${selectedTable}.js`}
                  value={fileNameOverride}
                  onChange={(e) => setFileNameOverride(e.target.value)}
                  suffix=".js"
                  allowClear
                />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 4, fontSize: 12 }}
                >
                  Model name
                </Text>
                <AntInput
                  size="small"
                  style={{ width: 220 }}
                  placeholder={
                    selectedTable
                      ? selectedTable
                          .replace(/[^a-zA-Z0-9]/g, "_")
                          .replace(/_+/g, "_")
                          .replace(/^_+|_+$/g, "")
                      : "cube_name"
                  }
                  value={cubeNameOverride}
                  onChange={(e) => setCubeNameOverride(e.target.value)}
                  allowClear
                />
              </div>
            </Space>
          </div>

          {error && (
            <Alert
              className={styles.errorMessage}
              message={error}
              type="error"
              showIcon
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Checkbox
              checked={skipLlm}
              onChange={(e) => setSkipLlm(e.target.checked)}
            >
              <Text style={{ fontSize: 12 }}>
                Skip LLM enrichment (faster, no AI metrics or descriptions)
              </Text>
            </Checkbox>
          </div>

          <div className={styles.actions}>
            <Button
              size="large"
              onClick={() => {
                setStep("select");
                setError(null);
              }}
            >
              {t("common:words.back")}
            </Button>
            <Button type="primary" size="large" onClick={handlePreviewChanges}>
              Preview Changes
            </Button>
          </div>
        </>
      )}

      {/* Step 4: Previewing changes (dry-run in progress) */}
      {step === "previewing_changes" && (
        <SimulatedProgress
          messages={[
            "Building cube definitions...",
            "Computing change preview...",
          ]}
          maxPercent={95}
          intervalMs={1500}
        />
      )}

      {/* Step 5: Change preview */}
      {step === "change_preview" && (
        <>
          {changePreview && <ChangePreviewPanel preview={changePreview} />}

          {/* AI Metric Suggestions — selectable checklist */}
          {suggestedAIMetrics.length > 0 && (
            <div style={{ margin: "16px 0" }}>
              <Title level={5}>
                AI-Generated Metrics ({selectedAIMetricNames.size}/
                {suggestedAIMetrics.length} selected)
              </Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                The LLM suggested the following calculated metrics. Uncheck any
                you don&apos;t want included in the model.
              </Text>
              <Space
                direction="vertical"
                style={{ width: "100%", maxHeight: 350, overflowY: "auto" }}
                size={4}
              >
                {suggestedAIMetrics.map((metric: any) => (
                  <div
                    key={metric.name}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "8px 12px",
                      background: selectedAIMetricNames.has(metric.name)
                        ? "#f6ffed"
                        : "#fafafa",
                      border: `1px solid ${
                        selectedAIMetricNames.has(metric.name)
                          ? "#b7eb8f"
                          : "#f0f0f0"
                      }`,
                      borderRadius: 6,
                    }}
                  >
                    <Checkbox
                      checked={selectedAIMetricNames.has(metric.name)}
                      onChange={(e) => {
                        setSelectedAIMetricNames((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) {
                            next.add(metric.name);
                          } else {
                            next.delete(metric.name);
                          }
                          return next;
                        });
                      }}
                      style={{ marginTop: 2 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text strong>{metric.name}</Text>
                        <Tag
                          color={
                            metric.fieldType === "measure" ? "blue" : "green"
                          }
                        >
                          {metric.fieldType}
                        </Tag>
                        <Tag>{metric.type}</Tag>
                      </div>
                      {metric.description && (
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, display: "block" }}
                        >
                          {metric.description}
                        </Text>
                      )}
                      {metric.ai_generation_context && (
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 11,
                            display: "block",
                            fontStyle: "italic",
                          }}
                        >
                          {metric.ai_generation_context}
                        </Text>
                      )}
                      {metric.sql && (
                        <Text
                          code
                          style={{
                            fontSize: 11,
                            display: "block",
                            marginTop: 4,
                          }}
                        >
                          {metric.sql}
                        </Text>
                      )}
                    </div>
                  </div>
                ))}
              </Space>
            </div>
          )}

          {error && (
            <Alert
              className={styles.errorMessage}
              message={error}
              type="error"
              showIcon
            />
          )}

          <div className={styles.actions}>
            <Button
              size="large"
              onClick={() => {
                setStep("select");
                setChangePreview(null);
                setSuggestedAIMetrics([]);
                setSelectedAIMetricNames(new Set());
                setSelectedModelFields(new Set());
                setError(null);
              }}
            >
              Start Over
            </Button>
            <Button
              size="large"
              onClick={() => {
                setStep("preview");
                setError(null);
              }}
            >
              {t("common:words.back")}
            </Button>
            {(changePreview &&
              (changePreview.fields_added.length > 0 ||
                changePreview.fields_updated.length > 0 ||
                changePreview.fields_removed.length > 0)) ||
            suggestedAIMetrics.length > 0 ? (
              <Button type="primary" size="large" onClick={handleApply}>
                Apply Changes
              </Button>
            ) : null}
          </div>
        </>
      )}

      {/* Step 6: Applying */}
      {step === "applying" && (
        <SimulatedProgress
          messages={["Applying merge strategy...", "Creating new version..."]}
          maxPercent={95}
          intervalMs={1500}
        />
      )}

      {/* Step 7: Done */}
      {step === "done" && genData && (
        <>
          <Alert
            message={
              genData.changed
                ? `Model generated: ${genData.file_name}`
                : "No changes detected"
            }
            description={genData.message}
            type={genData.changed ? "success" : "info"}
            showIcon
          />

          {genData.change_preview && (
            <div style={{ marginTop: 16 }}>
              <ChangePreviewPanel
                preview={genData.change_preview as ChangePreview}
              />
            </div>
          )}

          <div className={styles.actions}>
            <Button type="primary" size="large" onClick={onComplete}>
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartGeneration;
