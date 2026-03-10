import { useEffect, useState, type FC } from "react";
import {
  Form,
  Input as AntInput,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "urql";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Avatar from "@/components/Avatar";
import SmartGenSettings from "@/components/SmartGenSettings";
import type { Member, Team, TeamSettingsForm } from "@/types/team";
import { ChangeableRoles, Roles } from "@/types/team";

import styles from "./index.module.less";

const { Text } = Typography;

const UPDATE_TEAM_PROPERTIES = `
  mutation UpdateTeamProperties($team_id: uuid!, $properties: jsonb!) {
    update_team_properties(team_id: $team_id, properties: $properties) {
      success
    }
  }
`;

const UPDATE_MEMBER_ROLE = `
  mutation UpdateMemberRole(
    $pk_columns: member_roles_pk_columns_input!
    $_set: member_roles_set_input!
  ) {
    update_member_roles_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
    }
  }
`;

const DELETE_MEMBER = `
  mutation DeleteMember($id: uuid!) {
    delete_members_by_pk(id: $id) {
      id
    }
  }
`;

const INVITE_MEMBER = `
  mutation InviteMember($email: String!, $teamId: uuid!, $role: String, $magicLink: Boolean) {
    invite_team_member(email: $email, teamId: $teamId, role: $role, magicLink: $magicLink) {
      memberId
    }
  }
`;

interface TeamSettingsProps {
  onSubmit: (data: TeamSettingsForm) => void;
  initialValue?: TeamSettingsForm;
  team?: Team;
  isPortalAdmin?: boolean;
}

const TabDescription: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text
    type="secondary"
    style={{ display: "block", marginBottom: 16, fontSize: 13 }}
  >
    {children}
  </Text>
);

const MembersTab: FC<{
  members: Member[];
  teamId: string;
  isPortalAdmin: boolean;
}> = ({ members, teamId, isPortalAdmin }) => {
  const { t } = useTranslation(["common"]);
  const [, updateRole] = useMutation(UPDATE_MEMBER_ROLE);
  const [, deleteMember] = useMutation(DELETE_MEMBER);
  const [, inviteMember] = useMutation(INVITE_MEMBER);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");
  const [inviting, setInviting] = useState(false);

  const handleRoleChange = async (member: Member, newRole: string) => {
    if (!member.role?.id) {
      message.error("Cannot update role — missing role ID");
      return;
    }
    const res = await updateRole({
      pk_columns: { id: member.role.id },
      _set: { team_role: newRole },
    });
    if (res.data?.update_member_roles_by_pk) {
      message.success(`Role updated to ${newRole}`);
    } else {
      message.error("Failed to update role");
    }
  };

  const handleRemove = async (member: Member) => {
    const res = await deleteMember({ id: member.id });
    if (res.data?.delete_members_by_pk) {
      message.success("Member removed");
    } else {
      message.error("Failed to remove member");
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    const res = await inviteMember({
      email: inviteEmail.trim(),
      teamId,
      role: inviteRole,
      magicLink: true,
    });
    setInviting(false);
    if (res.data?.invite_team_member?.memberId) {
      message.success(`Invited ${inviteEmail}`);
      setInviteEmail("");
    } else {
      message.error(res.error?.message || "Failed to invite member");
    }
  };

  const columns = [
    {
      title: t("common:words.members"),
      key: "name",
      render: (_: unknown, record: Member) => (
        <Space size={8}>
          <Avatar
            img={record.avatarUrl}
            username={record.displayName}
            width={24}
            height={24}
          />
          {record.displayName || record.email}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Role",
      key: "role",
      width: isPortalAdmin ? 130 : 100,
      render: (_: unknown, record: Member) => {
        if (!isPortalAdmin) {
          return <Tag>{record.role?.name}</Tag>;
        }
        return (
          <Select
            size="small"
            value={record.role?.name}
            onChange={(val) => handleRoleChange(record, val)}
            style={{ width: 110 }}
            options={Object.values(Roles).map((r) => ({
              label: r,
              value: r,
            }))}
          />
        );
      },
    },
    ...(isPortalAdmin
      ? [
          {
            title: "",
            key: "actions",
            width: 80,
            render: (_: unknown, record: Member) => (
              <Popconfirm
                title="Remove this member?"
                onConfirm={() => handleRemove(record)}
              >
                <Button type="link" danger size="small">
                  Remove
                </Button>
              </Popconfirm>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className={styles.tabContent}>
      <TabDescription>
        View and manage team members. Change roles or remove members as needed.
      </TabDescription>

      {isPortalAdmin && (
        <Space.Compact style={{ marginBottom: 16, maxWidth: 500 }}>
          <AntInput
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onPressEnter={handleInvite}
            placeholder="Email address"
            style={{ flex: 1 }}
          />
          <Select
            value={inviteRole}
            onChange={setInviteRole}
            style={{ width: 110 }}
            options={Object.values(ChangeableRoles).map((r) => ({
              label: r,
              value: r,
            }))}
          />
          <Button
            type="primary"
            onClick={handleInvite}
            loading={inviting}
            disabled={!inviteEmail.trim()}
          >
            Invite
          </Button>
        </Space.Compact>
      )}

      <Table
        dataSource={members}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={
          members.length > 10 ? { pageSize: 10, size: "small" } : false
        }
        scroll={members.length > 8 ? { y: 400 } : undefined}
      />
    </div>
  );
};

const PropertiesTab: FC<{ team: Team }> = ({ team }) => {
  const [form] = Form.useForm();
  const [, updateProperties] = useMutation(UPDATE_TEAM_PROPERTIES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const settings = team.settings || {};
    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }));
    form.setFieldsValue({
      properties: entries.length > 0 ? entries : [{ key: "", value: "" }],
    });
  }, [team.id, team.settings, form]);

  const handleSave = async () => {
    const values = form.getFieldsValue();
    const properties: Record<string, unknown> = {};
    (values.properties || []).forEach(
      (entry: { key: string; value: string }) => {
        if (entry.key) {
          properties[entry.key] = entry.value || null;
        }
      }
    );

    setSaving(true);
    const res = await updateProperties({
      team_id: team.id,
      properties,
    });
    setSaving(false);

    if (res.data?.update_team_properties?.success) {
      message.success("Team properties updated");
    } else {
      message.error("Failed to update team properties");
    }
  };

  return (
    <div className={styles.tabContent}>
      <TabDescription>
        Manage key-value properties for this team. Properties like
        &quot;partition&quot; are used for data access controls.
      </TabDescription>

      <Form form={form} layout="vertical">
        <Form.List name="properties">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    label={name === 0 ? "Key" : ""}
                  >
                    <AntInput placeholder="Key" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    label={name === 0 ? "Value" : ""}
                  >
                    <AntInput placeholder="Value" />
                  </Form.Item>
                  <Popconfirm
                    title="Remove this property?"
                    onConfirm={() => remove(name)}
                  >
                    <Button type="link" danger size="small">
                      Remove
                    </Button>
                  </Popconfirm>
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => add({ key: "", value: "" })}
                block
              >
                Add Property
              </Button>
            </>
          )}
        </Form.List>
        <Button
          type="primary"
          onClick={handleSave}
          loading={saving}
          style={{ marginTop: 16 }}
        >
          Save Properties
        </Button>
      </Form>
    </div>
  );
};

const TeamSettings: FC<TeamSettingsProps> = ({
  initialValue,
  onSubmit,
  team,
  isPortalAdmin = false,
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const { control, handleSubmit } = useForm<TeamSettingsForm>({
    values: initialValue,
  });

  const members = team?.members || [];
  const isEditing = !!initialValue?.id;

  const generalContent = (
    <div className={styles.tabContent}>
      <TabDescription>
        {t("members.team_settings.team_name")} and basic team configuration.
      </TabDescription>

      <Form layout="vertical">
        <Input
          label={t("members.team_settings.team_name")}
          name="name"
          control={control}
          rules={{ required: true }}
          defaultValue={initialValue?.name}
        />

        <Button
          className={styles.submit}
          size="large"
          type="primary"
          onClick={handleSubmit(onSubmit)}
        >
          {t("members.team_settings.save")}
        </Button>
      </Form>
    </div>
  );

  if (!isEditing) {
    return (
      <div>
        <Text
          strong
          style={{ fontSize: 16, display: "block", marginBottom: 16 }}
        >
          {t("members.team_settings.title")}
        </Text>
        {generalContent}
      </div>
    );
  }

  if (!isPortalAdmin) {
    return (
      <div>
        <Text
          strong
          style={{ fontSize: 16, display: "block", marginBottom: 16 }}
        >
          {t("members.team_settings.title")}
        </Text>
        {generalContent}
        {members.length > 0 && (
          <MembersTab
            members={members}
            teamId={team!.id}
            isPortalAdmin={false}
          />
        )}
      </div>
    );
  }

  const tabItems = [
    {
      key: "general",
      label: "General",
      children: generalContent,
    },
    {
      key: "members",
      label: `Members (${members.length})`,
      children: (
        <MembersTab members={members} teamId={team!.id} isPortalAdmin />
      ),
    },
    {
      key: "properties",
      label: "Properties",
      children: <PropertiesTab team={team!} />,
    },
    {
      key: "smart-gen",
      label: "Smart Generation",
      children: (
        <div className={styles.tabContent}>
          <SmartGenSettings />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Text strong style={{ fontSize: 16, display: "block", marginBottom: 8 }}>
        {t("members.team_settings.title")}
      </Text>
      <Tabs items={tabItems} />
    </div>
  );
};

export default TeamSettings;
