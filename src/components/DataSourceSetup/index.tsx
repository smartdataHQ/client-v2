import { Alert, Col, Form, Row, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useResponsive } from "ahooks";
import cn from "classnames";
import { useForm } from "react-hook-form";

import type {
  DataSource,
  DataSoureSetupField,
  DataSourceSetupForm,
} from "@/types/dataSource";
import Input from "@/components/Input";
import Button from "@/components/Button";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;

interface DataSourceSetupProps {
  loading: boolean;
  dataSource: DataSource;
  fields: DataSoureSetupField[];
  isOnboarding: boolean;
  onSubmit: (values: DataSourceSetupForm) => void;
  onGoBack: () => void;
  onSkip?: () => void;
  onTestConnection: (data: DataSourceSetupForm, isTest?: boolean) => void;
  initialValue?: DataSourceSetupForm;
}

const DataSourceSetup: FC<DataSourceSetupProps> = ({
  loading = false,
  dataSource,
  fields,
  onSubmit,
  onGoBack,
  onSkip,
  onTestConnection,
  initialValue,
  isOnboarding = false,
}) => {
  const { t } = useTranslation(["dataSetupForm", "common"]);

  const [error] = useState<boolean>(false);

  const windowSize = useResponsive();

  const { control, handleSubmit, watch } = useForm<DataSourceSetupForm>({
    values: initialValue,
  });

  const getLabel = (key: string) => t(`common:form.labels.${key}`, key);
  const getPlaceholder = (key?: string) =>
    key ? t(`common:form.placeholders.${key}`, key) : "";

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <div className={styles.dataSource}>
          <div className={styles.iconWrapper}>{dataSource.icon}</div>
          <Title className={styles.title} level={3}>
            {dataSource.name}
          </Title>
        </div>

        <Text className={styles.text}>
          {t("text.line1")} <br /> {t("text.line2")}
        </Text>
      </div>
      <Spin spinning={loading}>
        <Form className={styles.form} id="setup-form" layout="vertical">
          <Input
            rules={{
              required: true,
            }}
            control={control}
            name="name"
            label={getLabel("name")}
            placeholder={getPlaceholder("name")}
            defaultValue={initialValue?.name}
          />

          <Row gutter={16}>
            {fields.map((f) => {
              const name = f.name.split(".")[1];
              const defaultValue = initialValue?.db_params?.[name];

              if (f.dependsOn) {
                const depValue = watch(f.dependsOn.field as any);
                if (depValue !== f.dependsOn.value) {
                  return null;
                }
              }

              return (
                <Col key={f.name} xs={24} sm={12}>
                  <Input
                    rules={f.rules}
                    control={control}
                    fieldType={f.type}
                    name={`db_params.${name}`}
                    placeholder={getPlaceholder(f.placeholder)}
                    label={getLabel(f.label)}
                    defaultValue={defaultValue}
                    options={f.options?.map((o) => ({
                      label: o.label,
                      value: o.value,
                    }))}
                  />
                </Col>
              );
            })}
          </Row>

          <Row align="middle" justify="space-between">
            <Col xs={24} md={18}>
              {isOnboarding && (
                <Button
                  className={cn(styles.back, {
                    [styles.fullwidth]: !windowSize.md,
                  })}
                  size="large"
                  color="primary"
                  onClick={onGoBack}
                >
                  {t("common:words.back")}
                </Button>
              )}
              <Button
                className={cn(styles.submit, {
                  [styles.fullwidth]: !windowSize.md,
                })}
                form="setup-form"
                type="primary"
                size="large"
                htmlType="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {isOnboarding
                  ? t("common:words.apply")
                  : t("common:words.save")}
              </Button>

              <Button
                className={cn(styles.link, {
                  [styles.fullwidth]: !windowSize.md,
                })}
                type="link"
                onClick={handleSubmit((data) => onTestConnection(data, true))}
              >
                {t("common:words.test_connection")}
              </Button>
            </Col>
            {!!onSkip && (
              <Col
                xs={24}
                md={6}
                className={cn(styles.skip, {
                  [styles.center]: !windowSize.md,
                })}
              >
                <Button
                  className={cn(styles.link, {
                    [styles.fullwidth]: !windowSize.md,
                  })}
                  type="link"
                  onClick={onSkip}
                >
                  {t("common:words.skip")}
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </Spin>
      {error && (
        <Alert
          message={<span className={styles.error}>Error</span>}
          type="error"
        />
      )}
    </div>
  );
};

export default DataSourceSetup;
