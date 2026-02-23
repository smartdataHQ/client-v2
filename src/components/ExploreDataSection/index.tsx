import { Col, Divider, Radio, Row, Tooltip } from "antd";
import { CSVLink } from "react-csv";
import { useResponsive, useSetState } from "ahooks";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import useAnalyticsQueryMembers from "@/hooks/useAnalyticsQueryMembers";
import Button from "@/components/Button";
import VirtualTable, { cellRenderer } from "@/components/VirtualTable";
import PrismCode from "@/components/PrismCode";
import ComponentSwitcher from "@/components/ComponentSwitcher";
import RestAPI from "@/components/RestAPI";
import genName from "@/utils/helpers/genName";
import type { DataSchemaFormValues } from "@/components/ExploreSettingsForm";
import ExploreSettingsForm from "@/components/ExploreSettingsForm";
import type { ExploreWorkspaceState } from "@/hooks/useExploreWorkspace";
import type { SortBySet } from "@/components/VirtualTable";
import type { ErrorMessage } from "@/types/errorMessage";
import type { CubeMember } from "@/types/cube";
import type { ExplorationState, PlaygroundState } from "@/types/exploration";
import EmptyExploration from "@/components/EmptyExploration";
import type { Branch, DataSourceInfo } from "@/types/dataSource";

import AlertIcon from "@/assets/alert.svg";
import ReportIcon from "@/assets/report.svg";
import ArrowIcon from "@/assets/arrow-small-right.svg";

import s from "./index.module.less";

import type { CollapsePanelProps, RadioChangeEvent } from "antd";
import type { FC, ReactNode } from "react";

type SortUpdater = (nextSortBy: SortBySet[]) => void;

interface ExploreDataSectionProps extends Omit<CollapsePanelProps, "header"> {
  width?: number;
  height?: number;
  onToggleSection: (section: string) => void;
  onSectionChange: (value: string) => void;
  onOpenModal: (type: string) => void;
  onExec: any;
  onQueryChange: (query: string, ...args: any) => void | SortUpdater;
  disabled: boolean;
  playgroundState: PlaygroundState;
  dataSource?: DataSourceInfo;
  currentBranch?: Branch;
  state: ExploreWorkspaceState;
  queryState: ExplorationState;
  disableButtons?: boolean;
  selectedQueryMembers: Record<string, CubeMember[]>;
  isActive: boolean;
  disableSectionChange?: boolean;
  disableSettings?: boolean;
  rowHeight?: number;
  screenshotMode?: boolean;
  emptyDesc?: ReactNode;
  className?: string;
  loading?: boolean;
}

const ExploreDataSection: FC<ExploreDataSectionProps> = (props) => {
  const {
    width,
    height,
    dataSource,
    currentBranch,
    onSectionChange = () => {},
    onOpenModal = () => {},
    onExec = () => {},
    onQueryChange = () => {},
    state: workspaceState,
    playgroundState,
    queryState,
    selectedQueryMembers,
    disableSectionChange,
    screenshotMode,
    rowHeight,
    disabled,
    loading = false,
    disableButtons,
  } = props;
  const { t } = useTranslation(["explore", "common"]);
  const windowSize = useResponsive();
  const isMobile = windowSize?.lg === false;
  const isMinSize = windowSize?.sm === false;
  const [currState, updateState] = useSetState({
    section: workspaceState?.dataSection || "sql",
  });

  // const formConfig = {
  //   rows: {
  //     label: t("data_section.rows_limit"),
  //     type: "number",
  //     defaultValue: 1000,
  //     min: 1,
  //     max: MAX_ROWS_LIMIT,
  //     rules: {
  //       validate: (val: number) =>
  //         !isNaN(val) && val > 0 && val <= MAX_ROWS_LIMIT,
  //     },
  //   },
  //   offset: {
  //     label: t("data_section.additional_offset"),
  //     type: "number",
  //     min: 0,
  //     defaultValue: 0,
  //     rules: {
  //       validate: (val: number) => !isNaN(val) && val >= 0,
  //     },
  //   },
  // };

  const {
    order,
    hitLimit,
    limit = 100,
    error,
    rows,
    columns,
    progress,
    settings,
    skippedMembers = [],
    offset = 0,
    // settings: { hideCubeNames, hideIndexColumn },
  } = queryState;

  const onRadioClick = (e: RadioChangeEvent) => {
    const {
      target: { value },
    } = e;

    updateState({
      section: value,
    });

    onSectionChange(value as string);
  };

  useEffect(() => {
    updateState({
      section: workspaceState?.dataSection,
    });
  }, [updateState, workspaceState?.dataSection]);

  const {
    baseMembers: { index: membersIndex },
  } = useAnalyticsQueryMembers({
    selectedQueryMembers,
    settings: queryState?.settings,
  });

  const empty = useMemo(
    () => (
      <div className={s.empty}>
        <EmptyExploration />
      </div>
    ),
    []
  );

  const Table = useMemo(() => {
    const messages: ErrorMessage[] = [];

    if (hitLimit) {
      messages.push({
        type: "warning",
        text: `${t("data_section.limit_error_1")} ${limit} ${t(
          "data_section.limit_error_2"
        )}`,
      });
    }

    if (skippedMembers.length) {
      messages.push({
        type: "warning",
        text: `${t("data_section.skipped")} ${skippedMembers.join(", ")}`,
      });
    }

    if (progress?.error) {
      messages.push({
        type: "error",
        text: progress.error,
      });
    }

    if (error) {
      messages.push({
        type: "warning",
        text: "error",
      });
    }

    const loadingTip = progress?.timeElapsed
      ? `${progress?.stage} ${(
          parseFloat(progress?.timeElapsed as unknown as string) / 1000
        ).toFixed(2)} secs...`
      : progress?.stage;

    if (!rows.length && !columns.length) {
      return empty;
    }

    return (
      <VirtualTable
        sortinMode="server-side"
        tableId={screenshotMode ? "explorationTable" : undefined}
        messages={messages}
        loading={screenshotMode ? false : loading}
        loadingTip={loadingTip}
        width={width}
        height={height}
        columns={columns}
        data={rows}
        sortBy={order}
        cellRenderer={(args) => cellRenderer(args, membersIndex)}
        onSortUpdate={onQueryChange("order") as SortUpdater}
        emptyComponent={<EmptyExploration />}
        className={s.table}
        settings={settings}
        rowHeight={rowHeight}
        toolbarExtra={
          <span className={s.toolbarInfo}>
            {t("data_section.shown")}: {rows.length} / {limit},{" "}
            {t("data_section.offset")}: {offset}, {t("data_section.columns")}:{" "}
            {columns.length}
          </span>
        }
      />
    );
  }, [
    hitLimit,
    skippedMembers,
    progress?.error,
    progress?.timeElapsed,
    progress?.stage,
    error,
    rows,
    screenshotMode,
    loading,
    width,
    height,
    columns,
    order,
    onQueryChange,
    settings,
    rowHeight,
    t,
    limit,
    empty,
    membersIndex,
    offset,
  ]);

  const Sql = useMemo(() => {
    const { rawSql } = queryState;

    if (!rawSql?.sql) {
      return empty;
    }

    return (
      <>
        <span className={s.sqlHeader}>{t("SQL")}</span>
        <PrismCode
          lang="sql"
          code={rawSql?.sql || ""}
          style={{ minHeight: 400 }}
        />
      </>
    );
  }, [empty, queryState, t]);

  const RestApi = useMemo(() => {
    if (dataSource?.id && currentBranch?.id) {
      return (
        <RestAPI
          dataSourceId={dataSource.id}
          branchId={currentBranch.id}
          playgroundState={playgroundState}
        />
      );
    }
  }, [currentBranch?.id, dataSource?.id, playgroundState]);

  const onChange = (values: Partial<DataSchemaFormValues>) => {
    if (values.limit !== limit) {
      onQueryChange("limit", values.limit);
    }
    if (values.offset !== offset) {
      onQueryChange("offset", values.offset);
    }
  };

  const growColumns = isMobile ? { flexGrow: 1 } : undefined;

  return (
    <div data-testid="explore-data-section" className={s.container}>
      <div className={s.header}>
        <Row justify={"start"} align={"middle"} gutter={[8, 8]}>
          <Col order={isMobile ? 1 : -1} xs={isMobile ? 24 : undefined}>
            <Button
              className={s.run}
              type="primary"
              onClick={onExec}
              disabled={!queryState?.columns?.length || disabled || loading}
            >
              <span style={{ marginRight: 10 }}>
                {t("data_section.run_query")}
              </span>
              <ArrowIcon />
            </Button>
          </Col>
          <Col xs={isMobile ? 24 : undefined}>
            <ExploreSettingsForm
              defaultValues={{
                limit,
                offset,
              }}
              onChange={onChange}
            />
          </Col>
          {!isMobile && <Divider className={s.divider} type="vertical" />}
          <Col style={{ flexGrow: 1 }} xs={isMobile ? 24 : undefined}>
            <Row justify={"space-between"} align={"middle"} gutter={[8, 8]}>
              <Col style={growColumns}>
                <Row gutter={[8, 8]}>
                  <Col style={growColumns}>
                    <Tooltip
                      placement="top"
                      title={t("data_section.create_alert")}
                      trigger="focus"
                      open={isMinSize ? undefined : false}
                    >
                      <Button
                        icon={<AlertIcon />}
                        className={cn(
                          s.alertButton,
                          isMobile && s.mobileButton
                        )}
                        type="default"
                        onClick={() => onOpenModal("alert")}
                        disabled={disableButtons}
                      >
                        {!isMinSize && t("data_section.create_alert")}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col style={growColumns}>
                    <Tooltip
                      placement="top"
                      title={t("data_section.create_report")}
                      trigger="focus"
                      open={isMinSize ? undefined : false}
                    >
                      <Button
                        icon={<ReportIcon />}
                        className={cn(
                          s.alertButton,
                          isMobile && s.mobileButton
                        )}
                        type="default"
                        onClick={() => onOpenModal("report")}
                        disabled={disableButtons}
                      >
                        {!isMinSize && t("data_section.create_report")}
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
              <Col style={growColumns}>
                <CSVLink data={rows} filename={`exploration-${genName(5)}.csv`}>
                  <Button
                    className={cn(s.csvBtn, isMobile && s.mobileButton)}
                    disabled={disableButtons}
                  >
                    {t("data_section.export")} .CSV
                  </Button>
                </CSVLink>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <div className={s.radio}>
        <Radio.Group
          value={currState.section}
          onChange={onRadioClick}
          disabled={disableSectionChange}
          className={cn(s.buttonGroup, isMobile && s.buttonGroupMobile)}
        >
          <Radio.Button value="results" type="text" className={s.radioButton}>
            {t("data_section.results")}
          </Radio.Button>
          <Radio.Button value="sql" type="text" className={s.radioButton}>
            {t("data_section.sql")}
          </Radio.Button>
          <Radio.Button value="rest" type="text" className={s.radioButton}>
            {t("data_section.rest_api")}
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className={s.wrapper}>
        <ComponentSwitcher
          activeItemIndex={["results", "sql", "rest"].findIndex(
            (sec) => sec === currState.section
          )}
          items={[Table, Sql, RestApi]}
        />
      </div>
    </div>
  );
};

export default ExploreDataSection;
