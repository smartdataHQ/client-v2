import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import type { DataSourceInfo, Schema } from "@/types/dataSource";
import {
  useProfileTableQuery,
  useSmartGenDataSchemasMutation,
} from "@/graphql/generated";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;

/** Animated progress bar that cycles through status messages. */
const SimulatedProgress: FC<{
  messages: string[];
  maxPercent?: number;
  intervalMs?: number;
}> = ({ messages, maxPercent = 95, intervalMs = 3000 }) => {
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
        <Text
          type="secondary"
          style={{ display: "block", marginTop: 8, fontSize: 12 }}
        >
          This may take a few minutes for large tables.
        </Text>
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

  const [profileResult, execProfile] = useProfileTableQuery({
    pause: true,
    variables: {
      datasource_id: dataSource.id!,
      branch_id: branchId,
      table_name: selectedTable || "_",
      table_schema: selectedSchema || "_",
    },
    requestPolicy: "network-only",
  });

  const [smartGenResult, execSmartGen] = useSmartGenDataSchemasMutation();

  // Auto-start profiling when pre-selected table is provided (reprofile flow)
  useEffect(() => {
    if (hasInitial && selectedTable && selectedSchema) {
      execProfile({
        datasource_id: dataSource.id!,
        branch_id: branchId,
        table_name: selectedTable,
        table_schema: selectedSchema,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to profile result changes
  useEffect(() => {
    if (step !== "profiling") return;

    if (profileResult.error) {
      setError(profileResult.error.message);
      setStep("select");
      return;
    }

    if (profileResult.data?.profile_table && !profileResult.fetching) {
      const profileData = profileResult.data.profile_table;
      if (profileData.existing_model?.suggested_merge_strategy) {
        setMergeStrategy(profileData.existing_model.suggested_merge_strategy);
      }
      // Cache raw profile for reuse during generation (avoids re-profiling ClickHouse)
      if (profileData.raw_profile) {
        setRawProfile(profileData.raw_profile);
      }
      // Initialize array join selections from candidates
      if (profileData.array_candidates?.length) {
        setArrayJoinSelections(
          profileData.array_candidates.filter(Boolean).map((c) => ({
            column: c!.column,
            alias: c!.suggested_alias,
            selected: false,
          }))
        );
      }
      setStep("preview");
    }
  }, [step, profileResult.data, profileResult.error, profileResult.fetching]);

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
    setStep("profiling");
    setError(null);
    setRawProfile(null);
    setChangePreview(null);
    execProfile({
      datasource_id: dataSource.id!,
      branch_id: branchId,
      table_name: selectedTable,
      table_schema: selectedSchema,
    });
  }, [selectedTable, selectedSchema, dataSource.id, branchId, execProfile]);

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

  const profileData = profileResult.data?.profile_table;
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

      {/* Step 2: Profiling in progress */}
      {step === "profiling" && (
        <SimulatedProgress
          messages={[
            "Discovering table schema...",
            "Analyzing column types...",
            "Profiling column statistics...",
            "Detecting cardinality...",
            "Probing low-cardinality values...",
            "Finalizing profile...",
          ]}
          maxPercent={95}
          intervalMs={3000}
        />
      )}

      {/* Step 3: Profile preview + options */}
      {step === "preview" && profileData && (
        <>
          <div className={styles.summarySection}>
            <Title level={5}>Profile Summary</Title>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Rows</div>
                <div className={styles.summaryValue}>
                  {(profileData.row_count ?? 0).toLocaleString()}
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Columns</div>
                <div className={styles.summaryValue}>
                  {profileData.columns?.length ?? 0}
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Primary Keys</div>
                <div className={styles.summaryValue}>
                  {profileData.primary_keys?.length ?? 0}
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Array Candidates</div>
                <div className={styles.summaryValue}>
                  {profileData.array_candidates?.length ?? 0}
                </div>
              </div>
            </div>
            {profileData.sampled && (
              <Text
                type="secondary"
                style={{ display: "block", marginTop: 8, fontSize: 12 }}
              >
                Sampled ({(profileData.sample_size ?? 0).toLocaleString()} rows)
              </Text>
            )}
          </div>

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
            <div className={styles.existingModelWarning}>
              <Alert
                message={`Existing model found: ${profileData.existing_model.file_name}`}
                description={
                  profileData.existing_model.file_format === "js" ? (
                    <Text type="warning">
                      The existing model is a JavaScript file. Smart Generate
                      creates YAML files. Both formats will coexist.
                    </Text>
                  ) : profileData.existing_model.has_user_content ? (
                    <Text>
                      The existing model contains user-edited content. Merge
                      strategy will preserve your changes.
                    </Text>
                  ) : (
                    <Text>
                      The existing model was auto-generated and can be safely
                      replaced.
                    </Text>
                  )
                }
                type="info"
                showIcon
              />
            </div>
          )}

          {profileData.existing_model && (
            <div className={styles.mergeOptions}>
              <Title level={5}>Merge Strategy</Title>
              <Radio.Group
                value={mergeStrategy}
                onChange={(e) => setMergeStrategy(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value="auto">
                    Auto (recommended &mdash;{" "}
                    {profileData.existing_model.suggested_merge_strategy})
                  </Radio>
                  <Radio value="merge">
                    Merge (preserve user content, add new fields)
                  </Radio>
                  <Radio value="replace">
                    Replace (overwrite existing model)
                  </Radio>
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
            <Button type="primary" size="large" onClick={handleApply}>
              Apply Changes
            </Button>
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
