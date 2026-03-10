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
  Typography,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import AuthTokensStore from "@/stores/AuthTokensStore";
import type { DataSourceInfo, Schema } from "@/types/dataSource";
import { useSmartGenDataSchemasMutation } from "@/graphql/generated";

import styles from "./index.module.less";

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
}

interface ChangeBlock {
  block: string;
  cube: string;
}

interface ChangePreview {
  fields_added: ChangeField[];
  fields_updated: ChangeField[];
  fields_removed: ChangeField[];
  fields_preserved: ChangeField[];
  blocks_preserved: ChangeBlock[];
  summary: string;
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

  const hasChanges =
    preview.fields_added.length > 0 ||
    preview.fields_updated.length > 0 ||
    preview.fields_removed.length > 0;

  return (
    <div className={styles.changePreview}>
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

      {preview.fields_preserved.length > 0 && (
        <div className={styles.changeSection}>
          <div className={styles.changeSectionHeader}>
            <Tag color="default">{preview.fields_preserved.length}</Tag>
            <Text strong>User fields preserved</Text>
          </div>
          <Table
            size="small"
            dataSource={preview.fields_preserved}
            columns={preservedColumns}
            rowKey={(r) => `${r.cube}.${r.name}`}
            pagination={
              preview.fields_preserved.length > 10 ? { pageSize: 10 } : false
            }
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

      {!hasChanges &&
        preview.fields_preserved.length === 0 &&
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
const ColumnList: FC<{ columns: any[]; rowCount: number }> = ({
  columns,
  rowCount,
}) => {
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ColumnFilter>("all");

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
}

const SmartGeneration: FC<SmartGenerationProps> = ({
  dataSource,
  schema,
  branchId,
  onComplete,
  onCancel,
  initialSchema,
  initialTable,
}) => {
  const { t } = useTranslation(["models", "common"]);
  const hasInitial = !!(initialSchema && initialTable);
  const [step, setStep] = useState<SmartGenStep>(
    hasInitial ? "profiling" : "select"
  );
  const [selectedSchema, setSelectedSchema] = useState<string>(
    initialSchema || ""
  );
  const [selectedTable, setSelectedTable] = useState<string>(
    initialTable || ""
  );
  const [mergeStrategy, setMergeStrategy] = useState<string>("auto");
  const [arrayJoinSelections, setArrayJoinSelections] = useState<
    ArrayJoinSelection[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [rawProfile, setRawProfile] = useState<any>(null);
  const [changePreview, setChangePreview] = useState<ChangePreview | null>(
    null
  );

  const [profileData, setProfileData] = useState<any>(null);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const [smartGenResult, execSmartGen] = useSmartGenDataSchemasMutation();

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

      const token = AuthTokensStore.getState().accessToken;

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
    [dataSource.id, branchId]
  );

  // Auto-start profiling when pre-selected table is provided (reprofile flow)
  useEffect(() => {
    if (hasInitial && selectedTable && selectedSchema) {
      startProfile(selectedSchema, selectedTable);
    }
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleTableSelect = useCallback((value: string) => {
    const [schemaName, tableName] = value.split("::");
    setSelectedSchema(schemaName);
    setSelectedTable(tableName);
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
    });

    if (result.error) {
      setError(result.error.message);
      setStep("preview");
      return;
    }

    const preview = result.data?.smart_gen_dataschemas?.change_preview;
    if (preview) {
      setChangePreview(preview as ChangePreview);
    }
    setStep("change_preview");
  }, [
    dataSource.id,
    branchId,
    selectedTable,
    selectedSchema,
    mergeStrategy,
    arrayJoinSelections,
    rawProfile,
    execSmartGen,
  ]);

  // Apply changes (real mutation) — uses cached profile, no ClickHouse query
  const handleApply = useCallback(async () => {
    setStep("applying");
    setError(null);

    const selectedArrayJoins = arrayJoinSelections
      .filter((a) => a.selected)
      .map((a) => ({ column: a.column, alias: a.alias }));

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
    });

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
              value={
                selectedTable
                  ? `${selectedSchema}::${selectedTable}`
                  : undefined
              }
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
            <ColumnList
              columns={profileData.columns.filter(Boolean) as any[]}
              rowCount={profileData.row_count ?? 0}
            />
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
                setStep("preview");
                setError(null);
              }}
            >
              {t("common:words.back")}
            </Button>
            {changePreview &&
              (changePreview.fields_added.length > 0 ||
                changePreview.fields_updated.length > 0 ||
                changePreview.fields_removed.length > 0) && (
                <Button type="primary" size="large" onClick={handleApply}>
                  Apply Changes
                </Button>
              )}
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
