import { Radio, Spin, Col, Form, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import cn from "classnames";

import Input from "@/components/Input";
import InfoBlock from "@/components/InfoBlock";
import Button from "@/components/Button";
import AuthTokensStore from "@/stores/AuthTokensStore";
import validations from "@/utils/helpers/validations";
import type { PlaygroundState } from "@/types/exploration";
import type { SortBy } from "@/types/sort";

import CopyIcon from "@/assets/copy.svg";

import styles from "./index.module.less";

import type { FC } from "react";

const CUBEJS_REST_API_URL =
  window.CUBEJS_REST_API_URL !== undefined
    ? window.CUBEJS_REST_API_URL
    : (import.meta.env.VITE_CUBEJS_REST_API_URL as string);

const CUBEJS_API_DOCS_URL =
  window.CUBEJS_API_DOCS_URL !== undefined
    ? window.CUBEJS_API_DOCS_URL
    : (import.meta.env.VITE_CUBEJS_API_DOCS_URL as string);

interface RestApiProps {
  dataSourceId: string;
  branchId: string;
  playgroundState: PlaygroundState;
}

interface RestApiState {
  loading: boolean;
  loadingTip?: string;
}

interface ApiResponse {
  error?: string;
  progress?: any;
}

const defaultState = {
  loading: false,
};

const normalizeOrders = (orders: SortBy[]) => {
  return (orders || []).reduce(
    (acc, cur) => ({ ...acc, [cur.id]: cur.desc ? "desc" : "asc" }),
    {}
  );
};

const RestAPI: FC<RestApiProps> = ({
  dataSourceId,
  branchId,
  playgroundState,
}) => {
  const { t } = useTranslation(["explore", "common"], { useSuspense: false });
  const { accessToken, workosAccessToken } = AuthTokensStore();
  const [authMethod, setAuthMethod] = useState<"workos" | "hasura">(
    workosAccessToken ? "workos" : "hasura"
  );
  const [state, setState] = useState<RestApiState>(defaultState);
  const activeToken =
    authMethod === "workos" && workosAccessToken
      ? workosAccessToken
      : accessToken;
  const { control, handleSubmit, setValue, getValues, watch } = useForm<any>({
    values: {
      json: JSON.stringify(
        {
          ...playgroundState,
          order: normalizeOrders(playgroundState?.order || []),
        },
        null,
        2
      ),
      "x-hasura-datasource-id": dataSourceId,
      "x-hasura-branch-id": branchId,
      token: `Bearer ${activeToken}`,
      url: CUBEJS_REST_API_URL,
      response: "",
    },
  });

  const onSubmit = async (values: any) => {
    setState({ ...defaultState, loading: true });

    let response: ApiResponse = {};

    const doFetch = async () => {
      const rawResponse = await fetch(values.url, {
        method: "POST",
        headers: {
          authorization: values.token,
          "Content-Type": "application/json",
          "x-hasura-datasource-id": values["x-hasura-datasource-id"],
          "x-hasura-branch-id": values["x-hasura-branch-id"],
        },
        body: JSON.stringify({
          query: values.json,
        }),
      });

      response = await rawResponse.json();
      if (response?.error === "Continue wait") {
        setState((prev) => ({ ...prev, loadingTip: response?.error }));
        await doFetch();
      }
    };

    try {
      await doFetch();
    } catch (e: any) {
      response.error = e?.message || e;
    }

    setValue("response", JSON.stringify(response, null, 2));
    setState(defaultState);
  };

  useEffect(() => {
    setValue("token", `Bearer ${activeToken}`);
  }, [authMethod, activeToken, setValue]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name === "token") {
        if (!values.token.includes("Bearer ")) {
          setValue("token", `Bearer ${values.token}`);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  const response = watch("response");

  return (
    <Spin
      spinning={state.loading}
      tip={state.loadingTip}
      data-testid="rest-api"
    >
      <Form layout="vertical" className={styles.form}>
        <Space style={{ width: "100%" }} direction="vertical" size={16}>
          {workosAccessToken && (
            <Form.Item label="Auth Method" className={styles.label}>
              <Radio.Group
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="workos">WorkOS</Radio.Button>
                <Radio.Button value="hasura">Hasura</Radio.Button>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item
            label={t("common:form.labels.headers")}
            className={styles.label}
          >
            <Input
              className={styles.input}
              addonBefore={
                <span className={styles.inputBefore}>Authorization</span>
              }
              name="token"
              control={control}
              placeholder="Bearer ...."
              rules={{
                required: true,
              }}
              suffix={
                <CopyIcon
                  className={styles.copy}
                  onClick={() =>
                    navigator.clipboard.writeText(getValues("token") || "")
                  }
                />
              }
            />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col flex={"auto"}>
              <Input
                className={styles.input}
                addonBefore={
                  <span className={styles.inputBefore}>
                    x-hasura-datasource-id
                  </span>
                }
                name="x-hasura-datasource-id"
                control={control}
                placeholder="datasource uuid ...."
                rules={{
                  required: true,
                }}
                suffix={
                  <CopyIcon
                    className={styles.copy}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        getValues("x-hasura-datasource-id") || ""
                      )
                    }
                  />
                }
              />
            </Col>
            <Col flex={"auto"}>
              <Input
                className={styles.input}
                addonBefore={
                  <span className={styles.inputBefore}>x-hasura-branch-id</span>
                }
                name="x-hasura-branch-id"
                control={control}
                placeholder="branch uuid"
                rules={{
                  required: true,
                }}
                suffix={
                  <CopyIcon
                    className={styles.copy}
                    onClick={() =>
                      navigator.clipboard.writeText(
                        getValues("x-hasura-branch-id") || ""
                      )
                    }
                  />
                }
              />
            </Col>
          </Row>

          <Input
            className={cn(styles.input)}
            label={t("common:form.labels.url")}
            name="url"
            control={control}
            addonBefore={<span className={styles.inputBefore}>POST</span>}
            suffix={
              <CopyIcon
                className={styles.copy}
                onClick={() =>
                  navigator.clipboard.writeText(getValues("url") || "")
                }
              />
            }
          />
          <Row style={{ width: "100%" }} gutter={10}>
            <Col xs={24} className={styles.textAreaWrapper}>
              <Input
                className={styles.input}
                label={t("common:form.labels.body")}
                name="json"
                style={{ height: 300, resize: "vertical" }}
                fieldType="textarea"
                control={control}
                rules={{
                  required: true,
                  validate: (v: string) =>
                    validations.json(v) || t("common:form.errors.json"),
                }}
                starColor="transparent"
              />
              <CopyIcon
                className={cn(styles.copy, styles.textAreaCopy)}
                onClick={() =>
                  navigator.clipboard.writeText(getValues("json") || "")
                }
              />
            </Col>
          </Row>

          <Space>
            <Button
              className={styles.submit}
              size="large"
              type="primary"
              onClick={handleSubmit(onSubmit)}
            >
              {t("common:words.send_request")}
            </Button>
            <InfoBlock
              className={styles.infoBlock}
              href={CUBEJS_API_DOCS_URL}
              linkText={t("common:words.rest_api_docs")}
            />
          </Space>

          {response && (
            <Row
              style={{ width: "100%", marginTop: 20 }}
              gutter={10}
              data-testid="response"
            >
              <Col xs={24} className={styles.textAreaWrapper}>
                <Input
                  className={cn(styles.input, styles.disabledInput)}
                  label={`${t("common:form.labels.request_output")}:`}
                  name="response"
                  style={{ height: 50, resize: "vertical" }}
                  fieldType="textarea"
                  control={control}
                  disabled
                  autoSize
                />
                <CopyIcon
                  className={cn(styles.copy, styles.textAreaCopy)}
                  onClick={() =>
                    navigator.clipboard.writeText(getValues("json") || "")
                  }
                />
              </Col>
            </Row>
          )}
        </Space>
      </Form>
    </Spin>
  );
};

export default RestAPI;
