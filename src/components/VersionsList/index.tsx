import { useMemo, useState } from "react";
import { Modal, Select, Space, Table, Tag, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import VersionDiff from "@/components/VersionDiff";
import formatTime, { formatRelativeTime } from "@/utils/helpers/formatTime";
import {
  diffSchemaVersions,
  restoreRelations,
  shortChecksum,
  type FileChange,
  type NamedCode,
  type SchemaDiff,
} from "@/utils/helpers/versionDiff";
import type { Dataschema } from "@/types/dataschema";
import type { Version } from "@/types/version";
import useVersions from "@/hooks/useVersions";
import useTableState from "@/hooks/useTableState";
import {
  useVersionOptions,
  useVersionsWithCode,
} from "@/hooks/useVersionCompare";

import DocsIcon from "@/assets/docs.svg";
import YAMLIcon from "@/assets/yml-flie.svg";

import styles from "./index.module.less";

import type { FC } from "react";
import type { TableProps } from "antd";

const { Title } = Typography;
const EMPTY_IDS: string[] = [];

type VersionUser = {
  display_name?: string | null;
  avatarUrl?: string | null;
  account?: { email?: string | null } | null;
};

const authorLabel = (user?: VersionUser | null, fallback = "") =>
  user?.display_name?.trim() || user?.account?.email || fallback;

interface VersionsListProps {
  branch?: string;
  onRestore: (checksum: string, dataschemas: Dataschema[]) => void;
}

const kindTagColor: Record<FileChange["kind"], string> = {
  added: "success",
  removed: "error",
  modified: "processing",
  unchanged: "default",
};

const filesFromVersion = (
  version?: { dataschemas?: NamedCode[] | null } | null
): NamedCode[] => version?.dataschemas ?? [];

const VersionFileChanges: FC<{
  diff?: SchemaDiff;
  caption: string;
  loading?: boolean;
}> = ({ diff, caption, loading }) => {
  const { t } = useTranslation(["models"]);
  const files = diff?.changedFiles ?? [];

  if (!files.length) {
    return (
      <div className={styles.noChanges}>
        {t("version_diff.no_file_changes")}
      </div>
    );
  }

  const expandedColumns: TableProps<FileChange>["columns"] = [
    {
      key: "name",
      dataIndex: "name",
      render: (value, file) => (
        <Space className={styles.fileName} size={8}>
          <YAMLIcon />
          {value}
          <Tag color={kindTagColor[file.kind]}>
            {t(`version_diff.${file.kind}`)}
          </Tag>
        </Space>
      ),
    },
    {
      key: "lines",
      render: (_, file) => (
        <span className={styles.changeStats}>
          <span className={styles.addedCount}>+{file.added}</span>
          <span className={styles.removedCount}>-{file.removed}</span>
        </span>
      ),
    },
  ];

  return (
    <Space className={styles.diffSection} size={8} direction="vertical">
      <span className={styles.diffCaption}>{caption}</span>
      <Table
        columns={expandedColumns}
        dataSource={files}
        rowKey={(file) => file.name}
        expandable={{
          expandedRowRender: (file) => <VersionDiff hunks={file.hunks} />,
          defaultExpandedRowKeys: files.length === 1 ? [files[0].name] : [],
        }}
        pagination={false}
        loading={loading}
      />
    </Space>
  );
};

const VersionsList: FC<VersionsListProps> = ({ onRestore, branch }) => {
  const { t } = useTranslation(["models", "common"]);
  const [restoreTarget, setRestoreTarget] = useState<Version | null>(null);
  const [compareFromId, setCompareFromId] = useState<string>();
  const [compareToId, setCompareToId] = useState<string>();

  const {
    tableState: { paginationVars, pageSize, currentPage },
    onPageChange,
  } = useTableState({ customPageSize: 5 });

  const {
    versions,
    currentVersion,
    totalCount,
    queries: {
      allData: { fetching },
    },
  } = useVersions({
    branchId: branch,
    pagination: {
      ...paginationVars,
      limit: pageSize + 1,
    },
  });

  const { options: versionOptions } = useVersionOptions(branch);
  const fetchCompareIds = useMemo(() => {
    if (!compareFromId || !compareToId || compareFromId === compareToId) {
      return EMPTY_IDS;
    }

    return [compareFromId, compareToId];
  }, [compareFromId, compareToId]);
  const { versions: fetchedCompareVersions, fetching: compareFetching } =
    useVersionsWithCode(fetchCompareIds);

  const displayedVersions = useMemo(
    () => versions.slice(0, pageSize),
    [versions, pageSize]
  );

  const isFirstPage = (paginationVars.offset ?? 0) === 0;
  const liveVersion =
    currentVersion ?? (isFirstPage ? displayedVersions[0] : undefined);

  const versionsById = useMemo(() => {
    const map = new Map<string, { id: string; dataschemas?: NamedCode[] }>();

    versions.forEach((version) => map.set(version.id, version));
    if (liveVersion) {
      map.set(liveVersion.id, liveVersion);
    }
    fetchedCompareVersions.forEach((version) => map.set(version.id, version));
    if (restoreTarget) {
      map.set(restoreTarget.id, restoreTarget);
    }

    return map;
  }, [fetchedCompareVersions, liveVersion, restoreTarget, versions]);

  const diffsById = useMemo(() => {
    const diffs = new Map<string, SchemaDiff>();

    displayedVersions.forEach((version, index) => {
      diffs.set(
        version.id,
        diffSchemaVersions(
          version.dataschemas,
          versions[index + 1]?.dataschemas
        )
      );
    });

    return diffs;
  }, [displayedVersions, versions]);

  const restoreMetaById = useMemo(() => {
    const catalog = [
      ...versionOptions,
      ...versions,
      ...displayedVersions,
      liveVersion,
    ].flatMap((version) => {
      if (!version?.id || !version.checksum || !version.created_at) {
        return [];
      }

      return [
        {
          id: version.id,
          checksum: version.checksum,
          created_at: version.created_at,
        },
      ];
    });

    return restoreRelations(catalog);
  }, [displayedVersions, liveVersion, versionOptions, versions]);

  const isLiveVersion = (record: Version) =>
    Boolean(liveVersion?.id && record.id === liveVersion.id);

  const matchesLiveChecksum = (record: Version) =>
    Boolean(
      liveVersion?.checksum &&
        record.checksum &&
        record.checksum === liveVersion.checksum
    );

  const restorePreviewDiff = useMemo(() => {
    if (!restoreTarget) {
      return undefined;
    }

    return diffSchemaVersions(
      filesFromVersion(restoreTarget),
      filesFromVersion(liveVersion)
    );
  }, [liveVersion, restoreTarget]);

  const compareDiff = useMemo(() => {
    if (!compareFromId || !compareToId || compareFromId === compareToId) {
      return undefined;
    }

    const fromVersion = versionsById.get(compareFromId);
    const toVersion = versionsById.get(compareToId);

    if (!fromVersion || !toVersion) {
      return undefined;
    }

    return diffSchemaVersions(
      filesFromVersion(toVersion),
      filesFromVersion(fromVersion)
    );
  }, [compareFromId, compareToId, versionsById]);

  const compareSelectOptions = (
    versionOptions.length ? versionOptions : displayedVersions
  ).map((version) => {
    const name = authorLabel(version.user as VersionUser | null | undefined);
    return {
      value: version.id,
      label: `${shortChecksum(version.checksum)} · ${formatTime(
        version.created_at,
        "YYYY-MM-DD HH:mm"
      )} (${formatRelativeTime(version.created_at)})${
        name ? ` · ${name}` : ""
      }`,
    };
  });

  const renderChangeSummary = (diff?: SchemaDiff) => {
    if (!diff) {
      return null;
    }

    if (diff.isInitial) {
      return (
        <span className={styles.initialVersion}>
          {t("version_diff.initial_version")}
        </span>
      );
    }

    if (!diff.changedFiles.length) {
      return (
        <span className={styles.noChanges}>
          {t("version_diff.no_file_changes")}
        </span>
      );
    }

    return (
      <div className={styles.changeStats}>
        <span className={styles.addedCount}>+{diff.addedLines}</span>
        <span className={styles.removedCount}>-{diff.removedLines}</span>
        <span className={styles.filesHint}>
          {t("version_diff.changed_files")}: {diff.changedFiles.length}
        </span>
      </div>
    );
  };

  const columns: TableProps<Version>["columns"] = [
    {
      title: t("common:words.checksum"),
      dataIndex: "checksum",
      key: "checksum",
      render: (value, record) => {
        const restoreMeta = restoreMetaById.get(record.id);
        const restoredFrom = restoreMeta?.restoredFrom;

        return (
          <div className={styles.checksumBlock}>
            <Space size={8} wrap>
              <span
                className={cn(styles.checksum, {
                  [styles.restoredChecksum]: Boolean(
                    restoredFrom || restoreMeta?.isRestoreSource
                  ),
                })}
              >
                {value}
              </span>
              {isLiveVersion(record) && (
                <Tag color="purple">{t("common:words.current")}</Tag>
              )}
            </Space>
            {restoredFrom && (
              <Tooltip title={formatTime(restoredFrom.created_at)}>
                <Tag className={styles.restoreTag} color="blue">
                  {t("models:version_diff.restored_from", {
                    defaultValue: "Restored from {{time}}",
                    time: formatTime(
                      restoredFrom.created_at,
                      "YYYY-MM-DD HH:mm"
                    ),
                  })}
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: t("common:words.created_at"),
      dataIndex: "created_at",
      key: "created_at",
      render: (value, record) => {
        const user = record.user as VersionUser | null | undefined;
        const name = authorLabel(user, t("version_diff.unknown_user"));

        return (
          <div className={styles.createdBlock}>
            <Space className={styles.author} size={8}>
              <Avatar
                username={name}
                img={user?.avatarUrl}
                width={22}
                height={22}
              />
              <span className={styles.authorName}>{name}</span>
            </Space>
            <span className={styles.createdAt}>
              {formatTime(value, "YYYY-MM-DD HH:mm")}{" "}
              <span className={styles.relativeTime}>
                ({formatRelativeTime(value)})
              </span>
            </span>
          </div>
        );
      },
    },
    {
      title: t("version_diff.changes"),
      key: "changes",
      render: (_, record) => renderChangeSummary(diffsById.get(record.id)),
    },
    {
      title: <div className={styles.actions}>{t("common:words.actions")}</div>,
      dataIndex: "actions",
      key: "actions",
      render: (_, record) =>
        isLiveVersion(record) || matchesLiveChecksum(record) ? (
          <div className={styles.actions} />
        ) : (
          <div className={styles.actions}>
            <Button
              className={styles.restore}
              icon={<DocsIcon className={styles.restoreIcon} />}
              onClick={() => setRestoreTarget(record)}
            >
              {t("common:words.restore")}
            </Button>
          </div>
        ),
    },
  ];

  const expandedRowRender = (record: Version) => {
    const diff = diffsById.get(record.id);

    return (
      <VersionFileChanges
        diff={diff}
        caption={
          diff?.isInitial
            ? t("version_diff.initial_version")
            : t("version_diff.compared_to_previous")
        }
        loading={fetching}
      />
    );
  };

  const confirmRestore = () => {
    if (!restoreTarget) {
      return;
    }

    const target = restoreTarget;
    setRestoreTarget(null);
    onRestore(target.checksum, target.dataschemas);
  };

  return (
    <Space className={styles.wrapper} size={16} direction="vertical">
      <Title level={3}>{t("versions_list")}</Title>
      {totalCount > 1 && (
        <Space className={styles.compareBar} size={8} wrap>
          <span className={styles.compareLabel}>
            {t("version_diff.compare")}
          </span>
          <Select
            className={styles.compareSelect}
            placeholder={t("version_diff.compare_from")}
            value={compareFromId}
            options={compareSelectOptions}
            onChange={setCompareFromId}
            showSearch
            optionFilterProp="label"
            allowClear
          />
          <Select
            className={styles.compareSelect}
            placeholder={t("version_diff.compare_to")}
            value={compareToId}
            options={compareSelectOptions}
            onChange={setCompareToId}
            showSearch
            optionFilterProp="label"
            allowClear
          />
        </Space>
      )}
      {compareFromId && compareToId && compareFromId === compareToId && (
        <div className={styles.noChanges}>{t("version_diff.same_version")}</div>
      )}
      {compareDiff && (
        <VersionFileChanges
          diff={compareDiff}
          caption={t("version_diff.compare_caption")}
          loading={compareFetching}
        />
      )}
      <Table
        className={styles.table}
        columns={columns}
        dataSource={displayedVersions}
        rowKey={(record) => record.id}
        expandable={{ expandedRowRender }}
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (current: number) => onPageChange({ current }),
          total: totalCount,
          showSizeChanger: false,
        }}
        loading={fetching}
      />
      <Modal
        open={Boolean(restoreTarget)}
        title={t("version_diff.restore_preview_title")}
        onCancel={() => setRestoreTarget(null)}
        zIndex={2000}
        width={920}
        footer={[
          <Button key="cancel" onClick={() => setRestoreTarget(null)}>
            {t("common:words.cancel")}
          </Button>,
          <Button
            key="restore"
            type="primary"
            onClick={confirmRestore}
            data-testid="confirm-restore"
          >
            {t("version_diff.confirm_restore")}
          </Button>,
        ]}
      >
        <VersionFileChanges
          diff={restorePreviewDiff}
          caption={t("version_diff.restore_preview_caption")}
        />
      </Modal>
    </Space>
  );
};

export default VersionsList;
