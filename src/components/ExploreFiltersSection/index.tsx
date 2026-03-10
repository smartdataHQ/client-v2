import { Space, Badge, Button, Collapse, type CollapsePanelProps } from "antd";
import { useTranslation } from "react-i18next";
import { RightOutlined } from "@ant-design/icons";

import ExploreDataFilters from "@/components/ExploreDataFilters";
import type { ExploreWorkspaceState } from "@/hooks/useExploreWorkspace";
import type { CubeMember } from "@/types/cube";

import s from "./index.module.less";

import type { FC } from "react";

interface ExploreFiltersSectionProps
  extends Omit<CollapsePanelProps, "header"> {
  onToggleSection: (section: string) => void;
  selectedQueryMembers: Record<string, (CubeMember | CubeMember)[]>;
  onMemberChange: (
    memberType: string,
    cb?: (member: CubeMember) => any
  ) => {
    add: (member: CubeMember) => void;
    remove: (member: CubeMember) => void;
    update: (member: CubeMember, newValue: any) => void;
  };
  availableQueryMembers: Record<
    string,
    Record<string, Record<string, CubeMember>>
  >;
  state: ExploreWorkspaceState;
  isActive?: boolean;
}

const toFilter = (member: CubeMember) => ({
  dimension: member.dimension!.name,
  operator: member.operator,
  values: member.values,
});

const { Panel } = Collapse;

const ExploreFiltersSection: FC<ExploreFiltersSectionProps> = (props) => {
  const { t } = useTranslation(["common"]);
  const {
    onToggleSection,
    onMemberChange,
    state,
    selectedQueryMembers,
    availableQueryMembers,
    isActive,
    ...restProps
  } = props;

  const onFilterChange = useMemo(
    () => onMemberChange("filters", toFilter),
    [onMemberChange]
  );

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
              className={s.filters}
              type="dashed"
              onClick={() => onToggleSection("filtersSec")}
            >
              <Space size={14}>
                {t("Filters")}

                <Badge
                  count={state.filtersCount}
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
        <ExploreDataFilters
          availableQueryMembers={availableQueryMembers}
          selectedQueryMembers={selectedQueryMembers}
          onMemberChange={onFilterChange}
        />
      </Panel>
    </Collapse>
  );
};

export default ExploreFiltersSection;
