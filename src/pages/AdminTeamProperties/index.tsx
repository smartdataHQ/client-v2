import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Typography,
  message,
  Tag,
  Popconfirm,
} from "antd";
import { useMutation } from "urql";

import usePortalAdmin from "@/hooks/usePortalAdmin";

const { Title, Text } = Typography;

const LIST_ALL_TEAMS = `
  mutation ListAllTeams($limit: Int, $offset: Int) {
    list_all_teams(limit: $limit, offset: $offset) {
      teams {
        id
        name
        settings
        member_count
        created_at
      }
      total
    }
  }
`;

const UPDATE_TEAM_PROPERTIES = `
  mutation UpdateTeamProperties($team_id: uuid!, $properties: jsonb!) {
    update_team_properties(team_id: $team_id, properties: $properties) {
      success
    }
  }
`;

interface TeamInfo {
  id: string;
  name: string;
  settings: Record<string, any> | null;
  member_count: number;
  created_at: string;
}

const AdminTeamProperties: React.FC = () => {
  const { isPortalAdmin } = usePortalAdmin();
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [, listTeams] = useMutation(LIST_ALL_TEAMS);
  const [, updateProperties] = useMutation(UPDATE_TEAM_PROPERTIES);

  const fetchTeams = async (offset = 0) => {
    setLoading(true);
    const res = await listTeams({ limit: 50, offset });
    const data = res.data?.list_all_teams;
    if (data) {
      setTeams(data.teams);
      setTotal(data.total);
    }
    setLoading(false);
  };

  // Fetch on first render
  useState(() => {
    if (isPortalAdmin) fetchTeams();
  });

  if (!isPortalAdmin) {
    return (
      <Card>
        <Text type="danger">Access denied. Portal admin required.</Text>
      </Card>
    );
  }

  const handleEdit = (team: TeamInfo) => {
    setEditingTeam(team);
    const settings = team.settings || {};
    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    }));
    form.setFieldsValue({
      properties: entries.length > 0 ? entries : [{ key: "", value: "" }],
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingTeam) return;
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
      team_id: editingTeam.id,
      properties,
    });

    if (res.data?.update_team_properties?.success) {
      message.success("Team properties updated");
      setModalOpen(false);
      fetchTeams();
    } else {
      message.error("Failed to update team properties");
    }
  };

  const columns = [
    {
      title: "Team",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Members",
      dataIndex: "member_count",
      key: "member_count",
    },
    {
      title: "Properties",
      key: "settings",
      render: (_: any, record: TeamInfo) => {
        const settings = record.settings || {};
        return (
          <Space wrap>
            {Object.entries(settings).map(([key, value]) => (
              <Tag key={key}>
                {key}:{" "}
                {typeof value === "string" ? value : JSON.stringify(value)}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TeamInfo) => (
        <Button size="small" onClick={() => handleEdit(record)}>
          Edit Properties
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Team Properties</Title>
      <Text type="secondary">
        Manage properties for all teams. Properties like &quot;partition&quot;
        are used for data access controls.
      </Text>

      <Table
        dataSource={teams}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          pageSize: 50,
          onChange: (page) => fetchTeams((page - 1) * 50),
        }}
        style={{ marginTop: 16 }}
      />

      <Modal
        title={`Edit Properties: ${editingTeam?.name || ""}`}
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

export default AdminTeamProperties;
