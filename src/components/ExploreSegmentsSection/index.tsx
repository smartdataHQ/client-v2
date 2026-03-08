import { Badge, Collapse, Space, Tag } from "antd";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import type { CubeMember } from "@/types/cube";

import s from "./index.module.less";

import type { CollapsePanelProps } from "antd";
import type { FC } from "react";

interface ExploreSegmentsSectionProps
  extends Omit<CollapsePanelProps, "header"> {
  segments: CubeMember[];
  onRemove: (member: CubeMember) => void;
  onToggleSection: (section: string) => void;
  isActive?: boolean;
}

const { Panel } = Collapse;
const { CheckableTag } = Tag;

const ExploreSegmentsSection: FC<ExploreSegmentsSectionProps> = ({
  segments,
  onRemove,
  onToggleSection = () => {},
  isActive = false,
  ...restProps
}) => {
  const { t } = useTranslation();

  return (
    <Collapse
      rootClassName={s.root}
      {...restProps}
      bordered={false}
      className={s.collapse}
      activeKey={isActive ? "filtersSec" : []}
      expandIconPosition="right"
    >
      <Panel
        {...restProps}
        className={s.panel}
        header={
          <div className={s.header}>
            <Button
              className={s.segments}
              type="dashed"
              onClick={() => onToggleSection("segmentsSec")}
            >
              <Space size={14}>
                {t("Segments")}

                <Badge
                  count={segments.length}
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
        key={"filtersSec"}
      >
        <Space size={10} wrap>
          {segments.map((segment, index) => (
            <CheckableTag
              key={segment.name}
              onClick={() => onRemove({ ...segment, index })}
              checked={false}
              className={s.tag}
            >
              {segment.shortTitle}

              <CloseOutlined
                style={{
                  marginLeft: 11,
                  fontSize: 8,
                  position: "relative",
                  bottom: 1,
                }}
              />
            </CheckableTag>
          ))}
        </Space>
      </Panel>
    </Collapse>
  );
};

export default ExploreSegmentsSection;
