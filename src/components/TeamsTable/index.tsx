import { Space, Table, Tag } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import Avatar, { AvatarGroup } from "@/components/Avatar";
import Button from "@/components/Button";
import type { User } from "@/types/user";
import type { Team } from "@/types/team";
import formatTime from "@/utils/helpers/formatTime";

import TrashIcon from "@/assets/trash.svg";

import styles from "./index.module.less";

import type { FC } from "react";
import type { TableProps } from "antd";

interface TeamsTableProps {
  teams: Team[];
  currentTeam: Team | null;
  onRemove: (id: string) => void;
  onEdit: (team: Team) => void;
}

const AVATAR_COLORS = ["#000000", "#3f6587", "#4a7faa"];

const TeamsTable: FC<TeamsTableProps> = ({
  teams,
  currentTeam,
  onEdit,
  onRemove,
}) => {
  const { t } = useTranslation(["teams", "common"]);

  const columns: TableProps<Team>["columns"] = [
    {
      title: t("common:words.team_name"),
      dataIndex: "name",
      key: "name",
      render: (value, record) => (
        <Space className={cn(styles.cell, styles.nameCell)} size={10}>
          {value}
          {record.id === currentTeam?.id && (
            <Tag className={styles.tag} color="#E0EAF0">
              {t("common:words.current")}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: t("common:words.members"),
      dataIndex: "members",
      key: "members",
      render: (value) => {
        return (
          <Space
            className={cn(styles.cell, styles.membersCell)}
            size={10}
            align="center"
          >
            <AvatarGroup>
              {value.slice(0, 3).map((member: User, idx: number) => (
                <Avatar
                  color={AVATAR_COLORS[idx]}
                  key={member.id}
                  img={member?.avatarUrl}
                  username={member?.displayName}
                  width={32}
                  height={32}
                />
              ))}
            </AvatarGroup>
            <span>
              {value.length} {t("common:words.members")}
            </span>
          </Space>
        );
      },
    },
    {
      title: t("common:words.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => (
        <span className={cn(styles.cell, styles.dateCell)}>
          {formatTime(value)}
        </span>
      ),
    },
    {
      title: (
        <span className={styles.actionsCell}>{t("common:words.actions")}</span>
      ),
      dataIndex: "actions",
      render: (_, record) => (
        <Space
          size={10}
          className={cn(styles.cell, styles.actionsCell)}
          align="center"
        >
          <Button
            className={styles.action}
            type="text"
            onClick={() => onEdit(record)}
          >
            <SettingOutlined key="setting" />
          </Button>
          <Button
            className={styles.action}
            type="text"
            onClick={() => onRemove(record.id)}
          >
            <TrashIcon />
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Table
      rootClassName={styles.table}
      dataSource={teams}
      rowKey={(record) => record.id}
      pagination={false}
      columns={columns}
    />
  );
};

export default TeamsTable;
