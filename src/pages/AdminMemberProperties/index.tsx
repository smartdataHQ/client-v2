import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  Select,
  message,
  Tag,
  Popconfirm,
} from "antd";
import { useMutation, useQuery } from "urql";

import usePortalAdmin from "@/hooks/usePortalAdmin";
import CurrentUserStore from "@/stores/CurrentUserStore";

const { Title, Text } = Typography;

const LIST_ALL_TEAMS = `
  mutation ListAllTeams($limit: Int, $offset: Int) {
    list_all_teams(limit: $limit, offset: $offset) {
      teams {
        id
        name
        member_count
      }
      total
    }
  }
`;

const TEAM_MEMBERS_ADMIN = `
  query TeamMembersAdmin($team_id: uuid!) {
    members(where: { team_id: { _eq: $team_id } }) {
      id
      user_id
      properties
      user {
        display_name
        account {
          email
        }
      }
      member_roles {
        team_role
      }
    }
  }
`;

const UPDATE_MEMBER_PROPERTIES = `
  mutation UpdateMemberProperties($member_id: uuid!, $properties: jsonb!) {
    update_member_properties(member_id: $member_id, properties: $properties) {
      success
    }
  }
`;

interface MemberInfo {
  id: string;
  user_id: string;
  properties: Record<string, any>;
  user: {
    display_name: string | null;
    account: { email: string } | null;
  };
  member_roles: { team_role: string }[];
}

interface TeamOption {
  id: string;
  name: string;
  member_count: number;
}

const AdminMemberProperties: React.FC = () => {
  const { isPortalAdmin } = usePortalAdmin();
  const { currentTeam } = CurrentUserStore();
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<MemberInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [, listTeams] = useMutation(LIST_ALL_TEAMS);
  const [, updateProperties] = useMutation(UPDATE_MEMBER_PROPERTIES);

  const [membersResult, reexecuteMembers] = useQuery({
    query: TEAM_MEMBERS_ADMIN,
    variables: { team_id: selectedTeamId },
    pause: !selectedTeamId,
  });

  const fetchTeams = async () => {
    const res = await listTeams({ limit: 200, offset: 0 });
    const data = res.data?.list_all_teams;
    if (data) {
      setTeams(data.teams);
    }
  };

  useEffect(() => {
    if (isPortalAdmin) fetchTeams();
  }, [isPortalAdmin]);

  useEffect(() => {
    // Default to the user's active team once team options are available.
    // Keep manual selection untouched.
    if (selectedTeamId || teams.length === 0) return;
    const currentTeamId = currentTeam?.id;
    if (currentTeamId && teams.some((team) => team.id === currentTeamId)) {
      setSelectedTeamId(currentTeamId);
      return;
    }
    setSelectedTeamId(teams[0].id);
  }, [teams, currentTeam?.id, selectedTeamId]);

  if (!isPortalAdmin) {
    return (
      <Card>
        <Text type="danger">Access denied. Portal admin required.</Text>
      </Card>
    );
  }

  const members: MemberInfo[] = membersResult.data?.members || [];

  const handleEdit = (member: MemberInfo) => {
    setEditingMember(member);
    const props = member.properties || {};
    const entries = Object.entries(props).map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }));
    form.setFieldsValue({
      properties: entries.length > 0 ? entries : [{ key: "", value: "" }],
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingMember) return;
    const values = form.getFieldsValue();
    const properties: Record<string, any> = {};
    (values.properties || []).forEach(
      (entry: { key: string; value: string }) => {
        if (entry.key) {
          properties[entry.key] = entry.value || null;
        }
      }
    );

    const res = await updateProperties({
      member_id: editingMember.id,
      properties,
    });

    if (res.data?.update_member_properties?.success) {
      message.success("Member properties updated");
      setModalOpen(false);
      reexecuteMembers({ requestPolicy: "network-only" });
    } else {
      message.error("Failed to update member properties");
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: any, record: MemberInfo) =>
        record.user?.display_name ||
        record.user?.account?.email ||
        record.user_id,
    },
    {
      title: "Email",
      key: "email",
      render: (_: any, record: MemberInfo) =>
        record.user?.account?.email || "-",
    },
    {
      title: "Role",
      key: "role",
      render: (_: any, record: MemberInfo) =>
        record.member_roles?.[0]?.team_role || "unknown",
    },
    {
      title: "Properties",
      key: "properties",
      render: (_: any, record: MemberInfo) => {
        const props = record.properties || {};
        return (
          <Space wrap>
            {Object.entries(props).map(([key, value]) => (
              <Tag key={key}>
                {key}: {String(value)}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MemberInfo) => (
        <Button size="small" onClick={() => handleEdit(record)}>
          Edit Properties
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Member Properties</Title>
      <Text type="secondary">
        Manage properties for team members. Properties are used for per-member
        data access controls.
      </Text>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Select
          placeholder="Select a team"
          style={{ width: 300 }}
          value={selectedTeamId}
          onChange={(val) => setSelectedTeamId(val)}
          options={teams.map((t) => ({
            label: `${t.name} (${t.member_count} members)`,
            value: t.id,
          }))}
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        />
      </div>

      {selectedTeamId && (
        <Table
          dataSource={members}
          columns={columns}
          rowKey="id"
          loading={membersResult.fetching}
        />
      )}

      <Modal
        title={`Edit Properties: ${
          editingMember?.user?.display_name ||
          editingMember?.user?.account?.email ||
          ""
        }`}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
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
                      <Input placeholder="Key" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      label={name === 0 ? "Value" : ""}
                    >
                      <Input placeholder="Value" />
                    </Form.Item>
                    <Popconfirm
                      title="Remove this property?"
                      onConfirm={() => remove(name)}
                    >
                      <Button type="link" danger>
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
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminMemberProperties;
