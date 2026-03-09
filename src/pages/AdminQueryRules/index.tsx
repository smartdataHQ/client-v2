import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
  Popconfirm,
} from "antd";
import { useMutation, useQuery } from "urql";

import usePortalAdmin from "@/hooks/usePortalAdmin";

const { Title, Text } = Typography;

const QUERY_RULES = `
  query QueryRewriteRules {
    query_rewrite_rules(order_by: { cube_name: asc }) {
      id
      cube_name
      dimension
      property_source
      property_key
      operator
      created_at
      updated_at
    }
  }
`;

const MANAGE_RULE = `
  mutation ManageQueryRewriteRule(
    $action: String!
    $id: uuid
    $cube_name: String
    $dimension: String
    $property_source: String
    $property_key: String
    $operator: String
  ) {
    manage_query_rewrite_rule(
      action: $action
      id: $id
      cube_name: $cube_name
      dimension: $dimension
      property_source: $property_source
      property_key: $property_key
      operator: $operator
    ) {
      success
      rule_id
    }
  }
`;

interface Rule {
  id: string;
  cube_name: string;
  dimension: string;
  property_source: string;
  property_key: string;
  operator: string;
  created_at: string;
  updated_at: string;
}

const AdminQueryRules: React.FC = () => {
  const { isPortalAdmin } = usePortalAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [form] = Form.useForm();

  const [rulesResult, reexecuteRules] = useQuery({ query: QUERY_RULES });
  const [, manageRule] = useMutation(MANAGE_RULE);

  if (!isPortalAdmin) {
    return (
      <Card>
        <Text type="danger">Access denied. Portal admin required.</Text>
      </Card>
    );
  }

  const rules: Rule[] = rulesResult.data?.query_rewrite_rules || [];

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({ operator: "equals", property_source: "team" });
    setModalOpen(true);
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      cube_name: rule.cube_name,
      dimension: rule.dimension,
      property_source: rule.property_source,
      property_key: rule.property_key,
      operator: rule.operator,
    });
    setModalOpen(true);
  };

  const handleDelete = async (ruleId: string) => {
    const res = await manageRule({ action: "delete", id: ruleId });
    if (res.data?.manage_query_rewrite_rule?.success) {
      message.success("Rule deleted");
      reexecuteRules({ requestPolicy: "network-only" });
    } else {
      message.error("Failed to delete rule");
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();

    const action = editingRule ? "update" : "create";
    const variables = {
      action,
      ...(editingRule ? { id: editingRule.id } : {}),
      ...values,
    };

    const res = await manageRule(variables);
    if (res.data?.manage_query_rewrite_rule?.success) {
      message.success(editingRule ? "Rule updated" : "Rule created");
      setModalOpen(false);
      reexecuteRules({ requestPolicy: "network-only" });
    } else {
      message.error(`Failed to ${action} rule`);
    }
  };

  const columns = [
    {
      title: "Table",
      dataIndex: "cube_name",
      key: "cube_name",
    },
    {
      title: "Column",
      dataIndex: "dimension",
      key: "dimension",
    },
    {
      title: "Source",
      dataIndex: "property_source",
      key: "property_source",
    },
    {
      title: "Property Key",
      dataIndex: "property_key",
      key: "property_key",
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Rule) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this rule?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space
        style={{
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Query Rewriting Rules
          </Title>
          <Text type="secondary">
            Rules map team/member properties to WHERE clause filters on tables.
            Any cube using the matching dimension gets filtered. Changes take
            effect within 60 seconds.
          </Text>
        </div>
        <Button type="primary" onClick={handleAdd}>
          Add Rule
        </Button>
      </Space>

      <Table
        dataSource={rules}
        columns={columns}
        rowKey="id"
        loading={rulesResult.fetching}
      />

      <Modal
        title={editingRule ? "Edit Rule" : "Add Rule"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cube_name"
            label="Table Name"
            rules={[{ required: true, message: "Table name is required" }]}
          >
            <Input placeholder="e.g., semantic_events" />
          </Form.Item>
          <Form.Item
            name="dimension"
            label="Column"
            rules={[
              { required: true, message: "Column name is required" },
              {
                validator: (_, value) =>
                  value && value.includes(".")
                    ? Promise.reject("Use short name only (no dots)")
                    : Promise.resolve(),
              },
            ]}
          >
            <Input placeholder="e.g., partition (column name on the table)" />
          </Form.Item>
          <Form.Item
            name="property_source"
            label="Property Source"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "Team", value: "team" },
                { label: "Member", value: "member" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="property_key"
            label="Property Key"
            rules={[{ required: true, message: "Property key is required" }]}
          >
            <Input placeholder="e.g., partition" />
          </Form.Item>
          <Form.Item
            name="operator"
            label="Operator"
            rules={[{ required: true }]}
          >
            <Select options={[{ label: "equals", value: "equals" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminQueryRules;
