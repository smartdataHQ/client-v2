import { Collapse, Form, Typography } from "antd";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SmartGenSettings from "@/components/SmartGenSettings";
import type { TeamSettingsForm } from "@/types/team";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title } = Typography;

interface TeamSettingsProps {
  onSubmit: (data: TeamSettingsForm) => void;
  initialValue?: TeamSettingsForm;
}

const TeamSettings: FC<TeamSettingsProps> = ({ initialValue, onSubmit }) => {
  const { t } = useTranslation(["settings", "common"]);
  const { control, handleSubmit } = useForm<TeamSettingsForm>({
    values: initialValue,
  });

  return (
    <Form layout="vertical">
      <Title level={4}>{t("members.team_settings.title")}</Title>

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

      {initialValue?.id && (
        <Collapse
          ghost
          style={{ marginTop: 16 }}
          items={[
            {
              key: "smart-gen",
              label: "Smart Generation Settings",
              children: <SmartGenSettings />,
            },
          ]}
        />
      )}
    </Form>
  );
};

export default TeamSettings;
