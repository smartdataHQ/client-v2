import { Col, Row, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import SearchInput from "@/components/SearchInput";
import PopoverButton from "@/components/PopoverButton";
import DataSourcesMenu from "@/components/DataSourcesMenu";
import DataSchemaForm from "@/components/DataSchemaForm";
import useSubstringSearch from "@/hooks/useSubstringSearch";
import Highlight from "@/components/Highlight";
import type { CreateBranchFormValues } from "@/components/BranchSelection";
import VersionPreview from "@/components/VersionPreview";
import BranchSelection from "@/components/BranchSelection";
import type { Branch, DataSourceInfo } from "@/types/dataSource";
import type { Dataschema } from "@/types/dataschema";

import TrashColoredIcon from "@/assets/trash-colored.svg";
import VerticalDots from "@/assets/dots-vertical.svg";
import EditIcon from "@/assets/edit.svg";
import YMLIcon from "@/assets/yml-flie.svg";
import JSIcon from "@/assets/js-file.svg";

import styles from "./index.module.less";

import type { FC } from "react";
import type { MenuProps } from "antd";

export interface ModelsSidebarProps {
  dataSourceId?: string | null;
  ideMenu: MenuProps["items"];
  branches: Branch[];
  currentBranch?: Branch;
  docs: string;
  version?: string;
  files: Dataschema[];
  branchLoading?: boolean;
  onSelectFile: (schema: string, hash?: string) => void;
  onSetDefault: (branchId?: string) => void;
  onCreateBranch: (data: CreateBranchFormValues) => Promise<void>;
  onChangeBranch: (branchId?: string) => void;
  onDeleteBranch: (branchId: string) => void;
  onSchemaDelete: (schema: Dataschema) => void;
  onSchemaUpdate: (
    values: Partial<Dataschema>[],
    editFile: Partial<Dataschema>
  ) => void;
  onCreateFile: (values: Partial<Dataschema>) => void;
  activeFile?: string | null;
  dataSources: DataSourceInfo[];
  onDataSourceChange: (dataSource: DataSourceInfo | null) => void;
  versionsCount?: number;
  onVersionsOpen?: () => void;
}

const icons = {
  js: <JSIcon className={styles.fileIcon} />,
  yml: <YMLIcon className={styles.fileIcon} />,
};

const ModelsSidebar: FC<ModelsSidebarProps> = ({
  branches,
  currentBranch,
  branchLoading,
  ideMenu,
  onChangeBranch,
  onSetDefault,
  docs,
  version,
  files,
  onCreateFile,
  onSelectFile,
  onCreateBranch,
  onDeleteBranch,
  onSchemaDelete,
  onSchemaUpdate,
  activeFile,
  dataSources,
  onDataSourceChange,
  dataSourceId,
  versionsCount,
  onVersionsOpen,
}) => {
  const { t } = useTranslation(["models", "common"]);

  const [isCreateFormOpen, setIsCreateFormOpen] = useState<boolean>(false);
  const [editPopover, setEditPopover] = useState<{
    id: string;
    type: "remove" | "edit";
  } | null>(null);
  const {
    term: searchTerm,
    matchedItems: filteredSchemas,
    setTerm,
  } = useSubstringSearch(files, "code");

  const onPopoverChange =
    (file: Dataschema, type: "remove" | "edit") => (isVisible: boolean) => {
      if (isVisible) {
        setEditPopover({
          id: file.id,
          type,
        });
      } else {
        setEditPopover(null);
      }
    };

  return (
    <Space
      size={12}
      direction="vertical"
      data-testid="models-sidebar"
      style={{ display: "flex" }}
    >
      <DataSourcesMenu
        selectedId={dataSourceId}
        entities={dataSources}
        onChange={onDataSourceChange}
      />
      <BranchSelection
        branches={branches}
        loading={branchLoading}
        currentBranch={currentBranch}
        onChangeBranch={onChangeBranch}
        onCreateBranch={onCreateBranch}
        onDeleteBranch={onDeleteBranch}
        onSetDefault={onSetDefault}
      />

      <div className={styles.inner}>
        <Space
          className={cn(styles.space, styles.versionRow)}
          size={10}
          direction="vertical"
        >
          {branches?.length && version && (
            <VersionPreview
              version={version}
              count={versionsCount}
              href={docs}
              onRestore={onVersionsOpen}
            />
          )}
        </Space>

        <Space className={styles.space} size={10} direction="vertical">
          <div className={cn(styles.row, styles.searchRow)}>
            <SearchInput
              className={styles.searchInput}
              value={searchTerm}
              onChange={(val) => setTerm(val.toLowerCase())}
              placeholder={t("common:form.placeholders.search")}
            />

            <PopoverButton
              trigger={["click"]}
              open={isCreateFormOpen}
              onOpenChange={setIsCreateFormOpen}
              buttonProps={{
                className: cn(styles.button, styles.plusButton),
                disabled: !branches?.length,
                icon: <PlusOutlined />,
              }}
              content={
                <DataSchemaForm
                  onSubmit={(data) => {
                    setIsCreateFormOpen(false);
                    onCreateFile(data);
                  }}
                />
              }
            />

            {ideMenu && (
              <PopoverButton
                className={cn(styles.dropdown, styles.schemaMenu)}
                popoverType="dropdown"
                buttonProps={{
                  className: cn(
                    styles.button,
                    styles.plusButton,
                    styles.menuBtn
                  ),
                  icon: <VerticalDots />,
                }}
                menu={{ items: ideMenu }}
                trigger={["click"]}
                arrow
                disabled={!branches?.length}
              />
            )}
          </div>

          <Space className={styles.fileList} size={4} direction="vertical">
            {((searchTerm && filteredSchemas) || files).map((f) => {
              return (
                <div
                  key={f.id}
                  className={cn(
                    styles.fileBtn,
                    f.name === activeFile && styles.fileBtnActive
                  )}
                  onClick={() => onSelectFile(f.name)}
                >
                  <Row justify={"space-between"} wrap={false}>
                    <Col className={styles.file} span={18} title={f.name}>
                      {icons[f.name.split(".")[1] as keyof typeof icons]}{" "}
                      <span className={styles.fileNameText}>{f.name}</span>
                    </Col>

                    <Col
                      span={6}
                      style={{ display: "flex", justifyContent: "end" }}
                    >
                      <Space
                        className={styles.fileControls}
                        align="center"
                        size={8}
                      >
                        <PopoverButton
                          className={styles.edit}
                          trigger={["click"]}
                          icon={<EditIcon className={styles.editIcon} />}
                          isVisible={
                            editPopover?.id === f.id &&
                            editPopover?.type === "edit"
                          }
                          onVisibleChange={onPopoverChange(f, "edit")}
                          content={
                            <DataSchemaForm
                              defaultValues={f}
                              onSubmit={(d) =>
                                onSchemaUpdate(files, {
                                  ...f,
                                  ...d,
                                })
                              }
                            />
                          }
                          buttonProps={{
                            size: "small",
                            type: "link",
                            className: styles.fileControl,
                          }}
                        />

                        <PopoverButton
                          popoverType="popconfirm"
                          title={t("sure_delete")}
                          buttonProps={{
                            size: "small",
                            type: "link",
                            className: styles.fileControl,
                          }}
                          isVisible={
                            editPopover?.id === f.id &&
                            editPopover?.type === "remove"
                          }
                          onVisibleChange={onPopoverChange(f, "remove")}
                          trigger={"click"}
                          onConfirm={(e) => {
                            e?.preventDefault();
                            e?.stopPropagation();
                            onSchemaDelete(f);
                          }}
                          okText={t("common:words.remove")}
                          cancelText={t("common:words.cancel")}
                          icon={
                            <TrashColoredIcon className={styles.trahsIcon} />
                          }
                        />
                      </Space>
                    </Col>
                  </Row>
                  {"matchedLines" in f &&
                    Object.entries(f.matchedLines || {}).map(
                      ([lineIndex, match]) => (
                        <Highlight
                          key={lineIndex}
                          index={Number(lineIndex)}
                          text={match.line}
                          indices={match.indices}
                        />
                      )
                    )}
                </div>
              );
            })}
          </Space>
        </Space>
      </div>
    </Space>
  );
};

export default ModelsSidebar;
