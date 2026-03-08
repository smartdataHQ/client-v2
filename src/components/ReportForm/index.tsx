import { Alert, Col, Form, Row, Space, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import cn from "classnames";
import construe from "cronstrue/i18n";

import Input from "@/components/Input";
import Button from "@/components/Button";
import QueryPreview from "@/components/QueryPreview";
import StepFormHeader from "@/components/StepFormHeader";
import { capitalize } from "@/utils/helpers/capitalize";
import validate from "@/utils/helpers/validations";
import type { QueryState } from "@/types/queryState";
import type { ReportFormType } from "@/types/report";
import { WEBHOOK_PLACEHOLDER } from "@/utils/constants/links";
import type { AlertType } from "@/types/alert";

import InfoIcon from "@/assets/info.svg";
import SendIcon from "@/assets/send.svg";

import styles from "./index.module.less";

import type { FC } from "react";

interface ReportFormProps {
  query: QueryState;
  onSubmit: (data: ReportFormType) => void;
  onTest: (data: ReportFormType) => void;
  onChangeStep?: (step: number) => void;
  type?: AlertType;
  initialValue?: ReportFormType;
  isSendTestLoading?: boolean;
}

const ReportForm: FC<ReportFormProps> = ({
  query,
  type = "WEBHOOK",
  initialValue,
  onSubmit,
  onTest,
  onChangeStep,
  isSendTestLoading,
}) => {
  const {
    t,
    i18n: { language: locale },
  } = useTranslation(["reports", "common"]);
  const [step, setStep] = useState(0);
  const { control, handleSubmit, watch } = useForm<ReportFormType>({
    values: initialValue,
  });

  const schedule = watch("schedule");

  useEffect(() => {
    if (type) setStep(1);
  }, [type]);

  return (
    <Form layout="vertical" data-testid="report-form">
      <Space className={cn(styles.space, styles.body)} size={16}>
        {!initialValue && (
          <div className={styles.header}>
            <StepFormHeader
              numbers={false}
              steps={[
                t("common:words.reports"),
                t("common:words.new"),
                capitalize(type),
              ]}
              onChange={onChangeStep}
              currentStep={step}
            />
          </div>
        )}
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Input
              rules={{ required: true }}
              label={t("form.report_name")}
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
                  rules={{
                    required: true,
                    validate: validate.cronExp,
                  }}
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
      </Space>
    </Form>
  );
};

export default ReportForm;
