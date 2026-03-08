import { Col, Dropdown, Row, Space, Spin, Tag, message } from "antd";
import { useTranslation } from "react-i18next";
import { SettingOutlined } from "@ant-design/icons";
import { useParams } from "@vitjs/runtime";

import Modal from "@/components/Modal";
import TeamSettings from "@/components/TeamSettings";
import PageHeader from "@/components/PageHeader";
import CurrentUserStore from "@/stores/CurrentUserStore";
import {
  useCreateTeamMutation,
  useEditTeamMutation,
  useDeleteTeamMutation,
} from "@/graphql/generated";
import useCheckResponse from "@/hooks/useCheckResponse";
import Avatar, { AvatarGroup } from "@/components/Avatar";
import Card from "@/components/Card";
import ConfirmModal from "@/components/ConfirmModal";
import NoTeams from "@/components/NoTeams";
import formatTime from "@/utils/helpers/formatTime";
import type { Member, Team, TeamSettingsForm } from "@/types/team";
import { Roles } from "@/types/team";
import useLocation from "@/hooks/useLocation";
import { TEAMS } from "@/utils/constants/paths";

import styles from "./index.module.less";

import type { ItemType } from "antd/lib/menu/hooks/useItems";

interface TeamsProps {
  userId: string;
  teams: Team[];
  currentTeam: Team | null;
  onCreateOrEditTeam: (data: TeamSettingsForm) => void;
  onRemoveTeam: (id: string) => void;
  onSelect: (id: string) => void;
  loading: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: (id?: string) => void;
  editId?: string;
}

const AVATAR_COLORS = ["#000000", "#3f6587", "#4a7faa"];

export const Teams: React.FC<TeamsProps> = ({
  userId,
  teams,
  currentTeam,
  onCreateOrEditTeam = () => {},
  onRemoveTeam = () => {},
  onSelect = () => {},
  loading = false,
  isOpen = false,
  onClose = () => {},
  onOpen = () => {},
  editId,
}) => {
  const { t } = useTranslation(["teams", "pages"]);

  const [selectedTeam, setSelectedTeam] = useState<TeamSettingsForm>();

  const onEdit = (team: Team) => {
    onOpen(team.id);
  };

  const onModalClose = () => {
    setSelectedTeam({ name: "" });
    onClose();
  };

  const onSubmit = (data: TeamSettingsForm) => {
    onCreateOrEditTeam(data);
    onClose?.();
  };

  const onCreate = () => {
    onOpen?.();
  };

  const renderCard = (team: Team) => {
    const teamRole = (team?.members || []).find((m) => m.user_id === userId)
      ?.role?.name;
    const hasEditPermissions = teamRole !== Roles.member;
    const hasDeletePermissions = teamRole === Roles.owner;

    return (
      <Card
        key={team.id}
        title={
          <>
            {team.name}
            {team.id === currentTeam?.id && (
              <Tag className={styles.tag} color="#E0EAF0">
                {t("common:words.current")}
              </Tag>
            )}
          </>
        }
        titleTooltip={team.name}
        onTitleClick={() => hasEditPermissions && onEdit(team)}
        extra={
          <Dropdown
            className={styles.btn}
            trigger={["click"]}
            menu={{
              items: [
                hasEditPermissions && {
                  key: "edit",
                  label: t("common:words.edit"),
                  onClick: () => onEdit(team),
                },
                {
                  key: "select",
                  label: t("common:words.set_current"),
                  onClick: () => onSelect(team.id),
                },
                hasDeletePermissions && {
                  key: "delete",
                  label: (
                    <ConfirmModal
                      title={t("common:words.delete_alert")}
                      onConfirm={() => onRemoveTeam(team.id)}
                    >
                      {t("common:words.delete")}
                    </ConfirmModal>
                  ),
                },
              ].filter(Boolean) as ItemType[],
            }}
          >
            <SettingOutlined key="setting" />
          </Dropdown>
        }
      >
        <dl>
          {team.members && (
            <>
              <dt>
                <span>
                  {team.members.length} {t("common:words.members")}
                </span>
              </dt>
              <dd>
                <Space size={10} align="center">
                  <AvatarGroup>
                    {team.members
                      .slice(0, 3)
                      .map((member: Member, idx: number) => (
                        <Avatar
                          key={member.id}
                          color={AVATAR_COLORS[idx]}
                          img={member?.avatarUrl}
                          username={member?.displayName}
                          width={32}
                          height={32}
                        />
                      ))}
                  </AvatarGroup>
                </Space>
              </dd>
            </>
          )}
          {team?.creatorEmail && (
            <>
              <dt>{t("common:words.creator")}</dt>
              <dd title={team?.creatorEmail}>{team?.creatorEmail}</dd>
            </>
          )}
          {team.createdAt && (
            <>
              <dt>{t("common:words.created_at")}</dt>
              <dd title={formatTime(team.createdAt)}>
                {formatTime(team.createdAt)}
              </dd>
            </>
          )}

          {team.updatedAt && (
            <>
              <dt>{t("common:words.updated_at")}</dt>
              <dd title={formatTime(team.updatedAt)}>
                {formatTime(team.updatedAt)}
              </dd>
            </>
          )}
        </dl>
      </Card>
    );
  };

  useEffect(() => {
    if (editId) {
      setSelectedTeam(teams.find((tm) => tm.id === editId));
    }
  }, [editId, teams]);

  return (
    <>
      <Space className={styles.wrapper} direction="vertical" size={13}>
        <PageHeader
          title={t("manage_teams")}
          action={t("create_team")}
          onClick={onCreate}
        />

        <Spin spinning={loading}>
          {teams.length ? (
            <div className={styles.body}>
              <Row justify={"start"} gutter={[32, 32]}>
                {teams?.map((tm) => (
                  <Col xs={24} sm={12} xl={8} key={tm.id}>
                    {renderCard(tm)}
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <NoTeams />
          )}
        </Spin>
      </Space>

      <Modal open={isOpen} closable onClose={onModalClose}>
        <TeamSettings initialValue={selectedTeam} onSubmit={onSubmit} />
      </Modal>
    </>
  );
};

const TeamsWrapper: React.FC = () => {
  const { t } = useTranslation(["teams", "pages"]);
  const { currentUser, currentTeam, loading, setLoading, setCurrentTeam } =
    CurrentUserStore();
  const [createMutation, execCreateMutation] = useCreateTeamMutation();
  const [updateMutation, execUpdateMutation] = useEditTeamMutation();
  const [deleteMutation, execDeleteMutation] = useDeleteTeamMutation();
  const { editId } = useParams();
  const isNew = editId === "new";
  const [, setLocation] = useLocation();

  useCheckResponse(
    createMutation,
    (data, err) => {
      if (data) message.success(t("team_created"));

      if (err?.message) {
        if (err.message.match("teams_user_id_name_key")) {
          message.error(t("team_name_error"));
        } else {
          message.error(err.message);
        }
      }
      setLoading(false);
    },
    {
      showMessage: false,
      showResponseMessage: false,
    }
  );

  useCheckResponse(
    updateMutation,
    () => {
      setLoading(false);
    },
    {
      successMessage: t("team_updated"),
    }
  );

  useCheckResponse(
    deleteMutation,
    () => {
      setLoading(false);
    },
    {
      successMessage: t("team_deleted"),
    }
  );

  const onCreateOrEditTeam = (data: TeamSettingsForm) => {
    setLoading(true);
    if (data.id) {
      execUpdateMutation({
        pk_columns: { id: data.id },
        _set: {
          name: data.name,
        },
      });
    } else {
      execCreateMutation({
        name: data.name,
      });
    }
  };

  const onRemoveTeam = (id: string) => {
    setLoading(true);
    execDeleteMutation({ id });
  };

  const onSelect = (id: string) => {
    setCurrentTeam(id);
  };

  const isLoading = useMemo(
    () =>
      loading ||
      createMutation.fetching ||
      updateMutation.fetching ||
      deleteMutation.fetching,
    [
      loading,
      createMutation.fetching,
      deleteMutation.fetching,
      updateMutation.fetching,
    ]
  );

  const onOpen = (id?: string) => {
    if (id) {
      setLocation(`${TEAMS}/${id}`);
    } else {
      setLocation(`${TEAMS}/new`);
    }
  };

  return (
    <Teams
      userId={currentUser.id}
      teams={currentUser.teams}
      currentTeam={currentTeam}
      onCreateOrEditTeam={onCreateOrEditTeam}
      onRemoveTeam={onRemoveTeam}
      onSelect={onSelect}
      loading={isLoading}
      isOpen={!!editId}
      editId={isNew ? undefined : editId}
      onClose={() => setLocation(TEAMS)}
      onOpen={onOpen}
    />
  );
};

export default TeamsWrapper;
