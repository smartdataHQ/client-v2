import { useState, useEffect } from "react";
import { Alert, Input, Space, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import useTeamSettings from "@/hooks/useTeamSettings";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;

const SmartGenSettings: FC = () => {
  const { t } = useTranslation(["settings", "common"]);
  const { settings, updating, updateError, updateSettings } = useTeamSettings();

  const [partition, setPartition] = useState(settings.partition ?? "");
  const [internalTables, setInternalTables] = useState<string[]>(
    settings.internal_tables ?? []
  );
  const [newTable, setNewTable] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPartition(settings.partition ?? "");
    setInternalTables(settings.internal_tables ?? []);
  }, [settings.partition, settings.internal_tables]);

  const handleAddTable = () => {
    const trimmed = newTable.trim();
    if (trimmed && !internalTables.includes(trimmed)) {
      setInternalTables([...internalTables, trimmed]);
      setNewTable("");
      setDirty(true);
    }
  };

  const handleRemoveTable = (table: string) => {
    setInternalTables(internalTables.filter((item) => item !== table));
    setDirty(true);
  };

  const handleSave = async () => {
    await updateSettings({
      partition: partition || null,
      internal_tables: internalTables,
    });
    setDirty(false);
  };

  return (
    <div className={styles.wrapper}>
      <Title level={5}>Smart Generation Settings</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        Configure partition isolation for smart-generated models. Internal
        tables will have profiling and queries scoped to the specified
        partition.
      </Text>

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div>
          <Text strong style={{ display: "block", marginBottom: 4 }}>
            Partition Value
          </Text>
          <Input
            value={partition}
            onChange={(e) => {
              setPartition(e.target.value);
              setDirty(true);
            }}
            placeholder="e.g., your_partition_id"
            style={{ maxWidth: 400 }}
          />
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 4, fontSize: 12 }}
          >
            Profiling queries and generated models will be scoped to this
            partition for internal tables.
          </Text>
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: 4 }}>
            Internal Tables
          </Text>
          <Text
            type="secondary"
            style={{ display: "block", marginBottom: 8, fontSize: 12 }}
          >
            Tables that should be filtered by the partition value above.
          </Text>
          <div style={{ marginBottom: 8 }}>
            {internalTables.map((table) => (
              <Tag
                key={table}
                closable
                onClose={() => handleRemoveTable(table)}
                style={{ marginBottom: 4 }}
              >
                {table}
              </Tag>
            ))}
          </div>
          <Space.Compact style={{ maxWidth: 400 }}>
            <Input
              value={newTable}
              onChange={(e) => setNewTable(e.target.value)}
              onPressEnter={handleAddTable}
              placeholder="Table name"
            />
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddTable}
              disabled={!newTable.trim()}
            >
              Add
            </Button>
          </Space.Compact>
        </div>

        {updateError && <Alert message={updateError} type="error" showIcon />}

        <Button
          type="primary"
          onClick={handleSave}
          loading={updating}
          disabled={!dirty}
        >
          {t("common:words.save")}
        </Button>
      </Space>
    </div>
  );
};

export default SmartGenSettings;
