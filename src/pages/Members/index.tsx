import { useParams } from "@vitjs/runtime";
import { Col, Row, Select, Space, Spin, Tag, Typography, message } from "antd";
import { useTranslation } from "react-i18next";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ConfirmModal from "@/components/ConfirmModal";
import type { Invite } from "@/components/MembersForm";
import MembersForm from "@/components/MembersForm";
import Modal from "@/components/Modal";
import NoMember from "@/components/NoMember";
import PageHeader from "@/components/PageHeader";
import type {
  AllAccessListsQuery,
  Member_Roles_Set_Input,
  Team_Roles_Enum,
} from "@/graphql/generated";
import {
  useAllAccessListsQuery,
  useDeleteMemberMutation,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/graphql/generated";
import useCheckResponse from "@/hooks/useCheckResponse";
import useLocation from "@/hooks/useLocation";
import CurrentUserStore from "@/stores/CurrentUserStore";
import type { AccessList, Member } from "@/types/team";
import { ChangeableRoles, Roles } from "@/types/team";
import { MEMBERS } from "@/utils/constants/paths";
import { capitalize } from "@/utils/helpers/capitalize";
import { createRoleOptions } from "@/utils/helpers/createRoleOptions";
import formatTime from "@/utils/helpers/formatTime";

import TrashColoredIcon from "@/assets/trash-colored.svg";

import styles from "./index.module.less";

const { Paragraph } = Typography;

interface MembersProps {
  userId: string;
  members: Member[];
  accessLists: AccessList[];
  currentRole?: Roles;
  loading?: boolean;
  onDeleteMember?: (id: string) => void;
  onInviteMember?: (data: Invite) => void;
  onRoleChange?: (id: string, newRole: ChangeableRoles) => void;
  onAccessListChange?: (id: string, accessListId: string | null) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const Members: React.FC<MembersProps> = ({
  userId,
  members,
  accessLists,
  currentRole,
  loading = false,
  onDeleteMember = () => {},
  onInviteMember = () => {},
  onRoleChange = () => {},
  onAccessListChange = () => {},
  onClose = () => {},
  onOpen = () => {},
  isOpen = false,
}) => {
  const { t } = useTranslation(["settings", "pages"]);

  const onSubmit = (data: Invite) => {
    onClose();
    onInviteMember(data);
  };
  const onRemove = (member: Member) => onDeleteMember(member.id);

  const renderCard = (member: Member) => {
    const hasRoleChangePermission =
      (currentRole === Roles.owner && member.role.name !== Roles.owner) ||
      (currentRole === Roles.admin && member.role.name === Roles.member);
    const hasChangeAccessPermission =
      member.role.name === Roles.member && currentRole !== Roles.member;

    return (
      <Card
        key={member.id}
        title={
          <div className={styles.title}>
            <Avatar
              username={member.displayName}
              img={member.avatarUrl}
              className={styles.cardAvatar}
            />
            <Paragraph ellipsis className={styles.paragraph}>
              {member.displayName}
            </Paragraph>
            {member.user_id === userId && (
              <Tag className={styles.tag} color="#E0EAF0">
                {t("common:words.current")}
              </Tag>
            )}
          </div>
        }
        titleTooltip={member.displayName}
        extra={
          hasRoleChangePermission && (
            <ConfirmModal
              title={t("common:words.delete_member")}
              onConfirm={() => onRemove(member)}
            >
              <Button size="small" type="text" className={styles.removeBtn}>
                <TrashColoredIcon />
              </Button>
            </ConfirmModal>
          )
        }
      >
        <dl className={styles.dl}>
          {member.email && (
            <>
              <dt>{t("common:words.email")}</dt>
              <dd title={member.email}>{member.email}</dd>
            </>
          )}

          {member.role && (
            <>
              <dt>{t("common:words.role")}</dt>
              <dd
                title={capitalize(member.role.name)}
                className={styles.roleName}
              >
                {hasRoleChangePermission ? (
                  <Select
                    onChange={(val) =>
                      onRoleChange(
                        member.role.id,
                        val as unknown as ChangeableRoles
                      )
                    }
                    variant="borderless"
                    value={member.role.name}
                    options={createRoleOptions(ChangeableRoles)}
                  />
                ) : (
                  capitalize(member.role.name)
                )}
              </dd>
              <dt>{t("common:words.access_list")}</dt>
              <dd
                title={capitalize(member.role.name)}
                className={styles.roleName}
              >
                {hasChangeAccessPermission ? (
                  <Select
                    onChange={(accessListId) => {
                      onAccessListChange(member.role.id, accessListId);
                    }}
                    variant="borderless"
                    disabled={!accessLists?.length}
                    value={
                      member.accessList?.id ||
                      capitalize(t("common:words.full_access").toUpperCase())
                    }
                    options={[
                      {
                        label: capitalize(
                          t("common:words.full_access").toUpperCase()
                        ),
                        value: null,
                      },
                      ...(accessLists || []).map((al) => ({
                        value: al.id,
                        label: al.name,
                      })),
                    ]}
                  />
                ) : (
                  member?.accessList?.name || capitalize(member.role.name)
                )}
              </dd>
            </>
          )}

          {member.updatedAt && (
            <>
              <dt>{t("common:words.updated_at")}</dt>
              <dd title={formatTime(member.updatedAt)}>
                {formatTime(member.updatedAt)}
              </dd>
            </>
          )}

          {member.createdAt && (
            <>
              <dt>{t("common:words.created_at")}</dt>
              <dd title={formatTime(member.createdAt)}>
                {formatTime(member.createdAt)}
              </dd>
            </>
          )}
        </dl>
      </Card>
    );
  };

  const hasInvitePermissions = currentRole !== Roles.member;
  const inviteRoles = useMemo(() => {
    const roles = ChangeableRoles as any;

    if (currentRole === Roles.admin) {
      delete roles.admin;
    }

    return createRoleOptions(roles);
  }, [currentRole]);

  return (
    <>
      <Space className={styles.wrapper} direction="vertical" size={13}>
        <PageHeader
          title={t("settings:members.title")}
          action={hasInvitePermissions && t("settings:members.action")}
          onClick={onOpen}
        />

        <Spin spinning={loading}>
          {members.length ? (
            <div className={styles.body}>
              <Row justify={"start"} gutter={[32, 32]}>
                {members.map((m) => (
                  <Col xs={24} sm={12} xl={8} key={m.id}>
                    {renderCard(m)}
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <NoMember onInvite={onOpen} />
          )}
        </Spin>
      </Space>

      <Modal open={isOpen} closable onClose={onClose}>
        <MembersForm onSubmit={onSubmit} inviteRoles={inviteRoles} />
      </Modal>
    </>
  );
};

const prepareAccessData = (accessResult: AllAccessListsQuery): AccessList[] => {
  if (!accessResult?.access_lists?.length) return [];

  return (accessResult.access_lists || []).map((al) => ({
    id: al.id,
    name: al.name,
    teamId: al.team_id,
    config: al.config,
    createdAt: al.created_at,
    updatedAt: al.updated_at,
  })) as AccessList[];
};

const MembersWrapper = () => {
  const { t } = useTranslation(["settings", "pages"]);
  const { currentUser, currentTeam, teamData, loading, setLoading } =
    CurrentUserStore();
  const [deleteMutation, execDeleteMutation] = useDeleteMemberMutation();
  const [inviteMutation, execInviteMutation] = useInviteMemberMutation();
  const [updateRoleMutation, execUpdateRoleMutation] =
    useUpdateMemberRoleMutation();
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const [allAccessLists, execAllAccessLists] = useAllAccessListsQuery({
    variables: {
      where: {
        team_id: {
          _eq: currentTeam?.id,
        },
      },
    },
    pause: true,
  });

  useCheckResponse(
    deleteMutation,
    (res) => {
      if (res.delete_members_by_pk?.id) {
        message.success(t("settings:members:member_deleted"));
      } else {
        message.warning(t("settings:members:no_permissions"));
      }
    },
    {
      successMessage: "",
    }
  );

  useCheckResponse(inviteMutation, () => {}, {
    successMessage: t("settings:members:member_invited"),
  });

  useCheckResponse(
    updateRoleMutation,
    (res) => {
      if (res.update_member_roles_by_pk?.id) {
        message.success(t("settings:members:role_updated"));
      } else {
        message.warning(t("settings:members:no_permissions"));
      }
    },
    {
      successMessage: "",
    }
  );

  const onDeleteMember = (id: string) => {
    setLoading(true);
    execDeleteMutation({ id });
  };

  const onRoleChange = (id: string, newRole: ChangeableRoles) => {
    setLoading(true);
    const roleObject = {
      team_role: newRole.toLowerCase() as Team_Roles_Enum,
    } as Member_Roles_Set_Input;

    if (newRole !== ChangeableRoles.member) {
      roleObject.access_list_id = null;
    }

    execUpdateRoleMutation({
      pk_columns: { id },
      _set: roleObject,
    });
  };

  const onAccessListChange = (id: string, accessListId: string | null) => {
    setLoading(true);
    execUpdateRoleMutation({
      pk_columns: { id },
      _set: {
        access_list_id: accessListId,
      },
    });
  };

  const onInviteMember = (data: Invite) => {
    setLoading(true);
    execInviteMutation({
      ...data,
      role: data.role.toLowerCase(),
      teamId: currentTeam?.id,
    });
  };

  useEffect(() => {
    if (currentTeam?.id) {
      execAllAccessLists();
    }
  }, [currentTeam?.id, execAllAccessLists]);

  const members = useMemo(() => teamData?.members || [], [teamData?.members]);
  const accessLists = useMemo(
    () =>
      prepareAccessData(allAccessLists?.data as unknown as AllAccessListsQuery),
    [allAccessLists]
  );

  return (
    <Members
      userId={currentUser?.id}
      members={members}
      loading={loading}
      accessLists={accessLists}
      currentRole={currentTeam?.role}
      onDeleteMember={onDeleteMember}
      onInviteMember={onInviteMember}
      onRoleChange={onRoleChange}
      onAccessListChange={onAccessListChange}
      isOpen={slug === "new"}
      onClose={() => setLocation(MEMBERS)}
      onOpen={() => setLocation(`${MEMBERS}/new`)}
    />
  );
};

export default MembersWrapper;
