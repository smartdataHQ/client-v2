import { Col, Collapse, Form, Row, Space, Table, Alert, Popover } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import cn from "classnames";
import construe from "cronstrue/i18n";

import StepFormHeader from "@/components/StepFormHeader";
import Button from "@/components/Button";
import NestedTag from "@/components/NestedTag";
import Input from "@/components/Input";
import QueryPreview from "@/components/QueryPreview";
import { capitalize } from "@/utils/helpers/capitalize";
import validate from "@/utils/helpers/validations";
import { QUERY_COLORS } from "@/utils/constants/colors";
import type { QueryState } from "@/types/queryState";
import type { AlertFormType, AlertType } from "@/types/alert";
import { WEBHOOK_PLACEHOLDER } from "@/utils/constants/links";

import InfoIcon from "@/assets/info.svg";
import SendIcon from "@/assets/send.svg";

import styles from "./index.module.less";

import type { FC } from "react";
import type { TableProps } from "antd";

const { Panel } = Collapse;

interface AlertFormProps {
  query: QueryState;
  onSubmit: (data: AlertFormType) => void;
  onTest: (data: AlertFormType) => void;
  onChangeStep?: (step: number) => void;
  type?: AlertType;
  initialValue?: AlertFormType;
  isSendTestLoading?: boolean;
}

const AlertForm: FC<AlertFormProps> = ({
  type = "WEBHOOK",
  query,
  initialValue,
  onSubmit,
  onChangeStep,
  onTest,
  isSendTestLoading,
}) => {
  const {
    t,
    i18n: { language: locale },
  } = useTranslation(["alerts", "common"]);
  const [step, setStep] = useState(0);
  const { control, handleSubmit, watch } = useForm<AlertFormType>({
    values: initialValue,
  });

  useEffect(() => {
    if (type) setStep(1);
  }, [type]);

  const schedule = watch("schedule");

  const columns: TableProps<{ name: string }>["columns"] = [
    {
      title: capitalize(t("common:words.measures")),
      width: "50%",
      render: (record) => {
        const name = record.name.split(".");
        return (
          <NestedTag
            tag={{ title: name[0], color: QUERY_COLORS.measure[0] }}
            nested={name.slice(1).map((n: string, i: number) => ({
              title: n,
              color: QUERY_COLORS.measure[1],
              key: typeof n === "string" ? name[0] + "." + n : i,
            }))}
          />
        );
      },
    },
    {
      title: t("common:words.lower_bound"),
      render: (record) => (
        <Input
          className={styles.input}
          control={control}
          name={`triggerConfig.measures.${record.name.replace(
            ".",
            ":"
          )}.lowerBound`}
          placeholder="0"
          rules={{
            validate: (val: number) => !isNaN(val),
          }}
          defaultValue={
            initialValue?.triggerConfig?.measures?.[
              record.name.replace(".", ":")
            ]?.lowerBound || 0
          }
        />
      ),
    },
    {
      title: t("common:words.upper_bound"),
      render: (record) => (
        <Input
          className={styles.input}
          control={control}
          name={`triggerConfig.measures.${record.name.replace(
            ".",
            ":"
          )}.upperBound`}
          placeholder="100"
          rules={{
            validate: (val: number) => !isNaN(val),
          }}
          defaultValue={
            initialValue?.triggerConfig?.measures?.[
              record.name.replace(".", ":")
            ]?.upperBound || 100
          }
        />
      ),
    },
  ];

  return (
    <Form
      className={styles.space}
      layout="vertical"
      id="alert-form"
      data-testid="alert-form"
    >
      {!initialValue && (
        <div className={styles.header}>
          <StepFormHeader
            numbers={false}
            steps={[
              t("common:words.alerts"),
              t("common:words.new"),
              capitalize(type),
            ]}
            onChange={onChangeStep}
            currentStep={step}
          />
        </div>
      )}

      <Space className={cn(styles.space, styles.body)} size={16}>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Input
              rules={{ required: true }}
              label={t("form.alert_name")}
              control={control}
              name="name"
              placeholder={t("common:form.placeholders.name")}
              defaultValue={initialValue?.name}
            />
          </Col>
          <Col span={24} md={12}>
            <Input
              label={t("form.type")}
              control={control}
              name="type"
              defaultValue={initialValue?.type || type}
              disabled
            />
          </Col>
        </Row>

        <Space direction="vertical" className={styles.space}>
          <span className={styles.subtitle}>{t("preview")}</span>
          <QueryPreview {...query} />
        </Space>

        <Space
          className={cn(styles.space, styles.metrics)}
          size={10}
          direction="vertical"
        >
          <div className={cn(styles.subtitle, styles.metricsTitle)}>
            {t("set_metrics_boundaries")}
          </div>
          <Table
            rootClassName={styles.table}
            columns={columns}
            dataSource={query?.measures?.map((m) => ({ name: m }))}
            pagination={false}
            rowKey={(record) => record.name}
          />
        </Space>

        <Row gutter={[16, 16]} align="stretch">
          <Col span={24} md={12}>
            <Space className={styles.space} size={10} direction="vertical">
              <span className={styles.subtitle}>{t("delivery_settings")}</span>
              <div className={styles.deliveryInput}>
                <Input
                  starPosition="left"
                  starColor="#4a7faa"
                  label={`${capitalize(type)}:`}
                  control={control}
                  rules={{
                    required: true,
                    validate:
                      type === "EMAIL"
                        ? (v: string) =>
                            validate.email(v) || t("common:form.errors.email")
                        : (v: string) =>
                            validate.url(v) || t("common:form.errors.url"),
                  }}
                  placeholder={
                    type === "EMAIL"
                      ? t("common:form.placeholders.email")
                      : WEBHOOK_PLACEHOLDER
                  }
                  name={
                    type === "EMAIL"
                      ? "deliveryConfig.address"
                      : "deliveryConfig.url"
                  }
                  defaultValue={
                    type === "EMAIL"
                      ? initialValue?.deliveryConfig?.address
                      : initialValue?.deliveryConfig?.url
                  }
                />
              </div>
            </Space>
          </Col>

          <Col span={24} md={12}>
            <Space className={styles.space} size={10} direction="vertical">
              <span className={styles.subtitle}>{t("trigger_settings")}</span>
              <div className={styles.deliveryInput}>
                <Input
                  rules={{ required: true, validate: validate.cronExp }}
                  starPosition="left"
                  starColor="#4a7faa"
                  label={
                    <span>
                      {t("schedule")} (
                      <a
                        className={styles.link}
                        href="https://crontab.guru/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("build_cron_expression")}
                      </a>
                      ):
                    </span>
                  }
                  control={control}
                  name="schedule"
                  placeholder="* * * * *"
                  defaultValue={initialValue?.schedule || "* * * * *"}
                  suffix={
                    <Popover content={t("common:words.in_utc_timezone")}>
                      <InfoIcon />
                    </Popover>
                  }
                />
              </div>
            </Space>
          </Col>
        </Row>

        <Collapse
          expandIcon={({ isActive }) =>
            isActive ? (
              <DownOutlined className={styles.arrow} />
            ) : (
              <UpOutlined className={styles.arrow} />
            )
          }
          bordered={false}
          className={styles.collapse}
        >
          <Panel
            className={styles.panel}
            header={
              <span className={styles.subtitle}>{t("advanced_settings")}</span>
            }
            key={"1"}
          >
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Input
                  rules={{
                    required: true,
                    validate: (val: number) => !isNaN(val) && val >= 0,
                  }}
                  starPosition="left"
                  starColor="#4a7faa"
                  className={styles.input}
                  label={t("form.request_timeout")}
                  control={control}
                  name="triggerConfig.requestTimeout"
                  fieldType="number"
                  placeholder="0"
                  defaultValue={0}
                />
              </Col>

              <Col span={24} md={12}>
                <Input
                  rules={{
                    required: true,
                    validate: (val: number) => !isNaN(val) && val >= 0,
                  }}
                  starPosition="left"
                  starColor="#4a7faa"
                  className={styles.input}
                  label={t("form.timeout_on_fire")}
                  control={control}
                  name="triggerConfig.timeoutOnFire"
                  fieldType="number"
                  placeholder="0"
                  defaultValue={0}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>

        <Alert
          className={styles.alert}
          message={
            <Row justify="space-between" align="middle">
              <Col>
                <span>{t("summary")}</span>:{" "}
                {schedule && validate.cronExp(schedule)
                  ? construe.toString(schedule, {
                      locale,
                      throwExceptionOnParseError: false,
                    })
                  : `${t("schedule_not_set")}, ${t("via")} ${capitalize(type)}`}
              </Col>
              <Col>
                <Button
                  className={styles.sendTest}
                  onClick={handleSubmit(onTest)}
                  loading={isSendTestLoading}
                  disabled={isSendTestLoading}
                >
                  <SendIcon /> {t("common:words.send_test")}
                </Button>
              </Col>
            </Row>
          }
          type="info"
        />
      </Space>

      <Button
        className={styles.saveBtn}
        type="primary"
        size="large"
        htmlType="submit"
        form="alert-form"
        onClick={handleSubmit(onSubmit)}
      >
        {t("common:words.save")}
      </Button>
    </Form>
  );
};

export default AlertForm;
