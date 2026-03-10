import { useState } from "react";
import { Modal, Radio, Space, Typography, Spin } from "antd";

import type { FC } from "react";

const { Text, Paragraph } = Typography;

export type MergeStrategy = "auto" | "merge" | "replace";

interface RegenerateModalProps {
  visible: boolean;
  onCancel: () => void;
  onRegenerate: (strategy: MergeStrategy) => void;
  sourceTable: string;
  sourceDatabase: string;
  isRegenerating: boolean;
}

const RegenerateModal: FC<RegenerateModalProps> = ({
  visible,
  onCancel,
  onRegenerate,
  sourceTable,
  sourceDatabase,
  isRegenerating,
}) => {
  const [strategy, setStrategy] = useState<MergeStrategy>("auto");

  return (
    <Modal
      title="Regenerate Model"
      open={visible}
      onCancel={onCancel}
      okText="Regenerate"
      onOk={() => onRegenerate(strategy)}
      okButtonProps={{ disabled: isRegenerating }}
      cancelButtonProps={{ disabled: isRegenerating }}
    >
      <Spin spinning={isRegenerating}>
        <Paragraph>
          Re-profile{" "}
          <Text strong>
            {sourceDatabase}.{sourceTable}
          </Text>{" "}
          and update the model.
        </Paragraph>

        <Radio.Group
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Radio value="auto">
              <Text strong>Auto</Text>{" "}
              <Text type="secondary">(recommended)</Text>
              <br />
              <Text type="secondary" style={{ marginLeft: 24 }}>
                Automatically detect user content and merge if found
              </Text>
            </Radio>
            <Radio value="merge">
              <Text strong>Merge</Text>
              <br />
              <Text type="secondary" style={{ marginLeft: 24 }}>
                Keep user-added joins, pre-aggregations, and custom members
              </Text>
            </Radio>
            <Radio value="replace">
              <Text strong>Replace</Text>
              <br />
              <Text type="secondary" style={{ marginLeft: 24 }}>
                Replace everything with fresh profile output
              </Text>
            </Radio>
          </Space>
        </Radio.Group>
      </Spin>
    </Modal>
  );
};

export default RegenerateModal;
