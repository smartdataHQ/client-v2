import { Badge, Collapse, Select, Space } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import type { CubeMember } from "@/types/cube";

import s from "./index.module.less";

import type { CollapsePanelProps } from "antd";
import type { FC } from "react";

interface ExploreelectorsSectionProps
  extends Omit<CollapsePanelProps, "header"> {
  requiredParams: CubeMember[];
  selectorValues: Record<string, string>;
  onSelectorChange: (dimensionName: string, value: string) => void;
  onToggleSection: (section: string) => void;
  isActive?: boolean;
}

const { Panel } = Collapse;

const ExploreSelectorsSection: FC<ExploreelectorsSectionProps> = ({
  requiredParams,
  selectorValues,
  onSelectorChange,
  onToggleSection = () => {},
  isActive = false,
  ...restProps
}) => {
  const { t } = useTranslation();

  if (requiredParams.length === 0) return null;

  return (
    <Collapse
      rootClassName={s.root}
      {...restProps}
      bordered={false}
      className={s.collapse}
      activeKey={isActive ? "selectorsSec" : []}
      expandIconPosition="right"
    >
      <Panel
        {...restProps}
        className={s.panel}
        header={
          <div className={s.header}>
            <Button
              className={s.selectors}
              type="dashed"
              onClick={() => onToggleSection("selectorsSec")}
            >
              <Space size={14}>
                {t("common:words.selectors", { defaultValue: "Selectors" })}
                <Badge
                  count={requiredParams.length}
                  style={{
                    backgroundColor: "#E0EAF0",
                    color: "rgba(0, 0, 0, 0.56)",
                    padding: "0 10px",
                  }}
                />
              </Space>
            </Button>
            <RightOutlined className={s.arrow} rotate={isActive ? 90 : 0} />
          </div>
        }
        showArrow={false}
        key="selectorsSec"
      >
        <div className={s.selectorsList}>
          {requiredParams.map((param) => {
            const knownValues: string[] = Array.isArray(
              param.meta?.known_values
            )
              ? param.meta.known_values
              : [];
            const currentValue = selectorValues[param.name] || "";

            return (
              <div key={param.name} className={s.selectorRow}>
                <span className={s.selectorLabel}>
                  {param.shortTitle || param.title}
                </span>
                <Select
                  size="middle"
                  style={{ minWidth: 180 }}
                  value={currentValue || undefined}
                  onChange={(value: string) =>
                    onSelectorChange(param.name, value)
                  }
                  placeholder="Select value"
                >
                  {knownValues.map((val) => (
                    <Select.Option key={val} value={val}>
                      {val}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            );
          })}
        </div>
      </Panel>
    </Collapse>
  );
};

export default ExploreSelectorsSection;
