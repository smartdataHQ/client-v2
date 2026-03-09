import { useTranslation } from "react-i18next";
import { Col, Form, Row, Typography } from "antd";
import { useForm } from "react-hook-form";

import Input from "@/components/Input";
import Button from "@/components/Button";
import validate from "@/utils/helpers/validations";

import styles from "./index.module.less";

import type { FC } from "react";

export interface GeneralInfo {
  displayName: string;
  email: string;
}

interface GeneralInfoFormProps {
  initialValue?: GeneralInfo;
  onSubmit: (data: GeneralInfo) => void;
  disabled?: boolean;
}

const { Title } = Typography;

const GeneralInfoForm: FC<GeneralInfoFormProps> = ({
  initialValue,
  onSubmit,
  disabled = false,
}) => {
  const { t } = useTranslation(["settings", "common"]);

  const { control, handleSubmit } = useForm<GeneralInfo>({
    values: initialValue,
  });

  return (
    <Form layout="vertical">
      <Title level={5} className={styles.title}>
        {t("personal_info.general_info.title")}
      </Title>

      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Input
            control={control}
            rules={disabled ? {} : { required: true }}
            name="displayName"
            label={t("common:form.labels.full_name")}
            defaultValue={initialValue?.displayName}
            disabled={disabled}
          />
        </Col>

        <Col span={24} md={12}>
          <Input
            label={t("common:form.labels.email")}
            placeholder={t("common:form.placeholders.email")}
            control={control}
            rules={
              disabled
                ? {}
                : {
                    required: true,
                    validate: (v: string) =>
                      validate.email(v) || t("common:form.errors.email"),
                  }
            }
            name="email"
            disabled={disabled}
          />
        </Col>
      </Row>

      {!disabled && (
        <Button
          htmlType="submit"
          size="large"
          type="primary"
          onClick={handleSubmit(onSubmit)}
        >
          {t("personal_info.general_info.update")}
        </Button>
      )}
    </Form>
  );
};

export default GeneralInfoForm;
