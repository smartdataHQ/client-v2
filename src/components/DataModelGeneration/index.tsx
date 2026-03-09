import { Col, Collapse, Empty, Form, Row, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useResponsive } from "ahooks";
import { useForm } from "react-hook-form";

import Input from "@/components/Input";
import type {
  DataSource,
  DataSourceInfo,
  DynamicForm,
  Schema,
  Table,
} from "@/types/dataSource";
import SearchInput from "@/components/SearchInput";
import TableSelection from "@/components/TableSelection";
import Button from "@/components/Button";

import TableIcon from "@/assets/table.svg";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface DataModelGenerationProps {
  dataSource: DataSource | DataSourceInfo;
  schema: Schema | undefined;
  isOnboarding: boolean;
  isGenerate: boolean;
  onSubmit: (data: DynamicForm, format: string) => void;
  onGoBack?: () => void;
  onSkip?: () => void;
  initialValue?: DynamicForm;
  loading?: boolean;
  resetOnSubmit?: boolean;
  smartGenTables?: string[];
  onSmartGenerate?: (schemaName: string, tableName: string) => void;
}

const options = [
  { label: "YAML", value: "yaml", disabled: false },
  { label: "JS", value: "js", disabled: false },
];

const DataModelGeneration: FC<DataModelGenerationProps> = ({
  dataSource,
  schema,
  onSubmit,
  onGoBack,
  onSkip,
  isGenerate = false,
  isOnboarding = false,
  initialValue = {},
  loading = false,
  resetOnSubmit = false,
  smartGenTables = [],
  onSmartGenerate,
}) => {
  const { t } = useTranslation(["dataModelGeneration", "common"]);

  const { control, handleSubmit, watch, reset } = useForm<DynamicForm>({
    values: initialValue,
  });

  const windowSize = useResponsive();

  const [searchValue, setSearchValue] = useState<string>("");

  const getCount = (val: DynamicForm, key: string) => {
    const keys = key.split(".");
    let current = val;

    for (const k of keys) {
      if (current[k]) {
        current = current[k];
      } else {
        return 0;
      }
    }

    return Object.keys(current).filter((k) => current[k] === true).length;
  };

  const onFormSubmit = (data: DynamicForm, type: string) => {
    onSubmit(data, type);
    if (resetOnSubmit) reset();
  };

  const filteredSchema =
    schema &&
    Object.keys(schema).reduce((res, s) => {
      if (s.toLowerCase().includes(searchValue)) {
        res[s] = schema[s];
      } else {
        const filteredTables = Object.keys(schema[s]).reduce((r, tb) => {
          if (tb.toLowerCase().includes(searchValue)) {
            r[tb] = schema[s][tb];
          }
          return r;
        }, {} as Table);

        if (Object.keys(filteredTables).length > 0) {
          res[s] = filteredTables;
        }
      }
      return res;
    }, {} as Schema);

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <div className={styles.dataSource}>
          {"icon" in dataSource && (
            <div className={styles.iconWrapper}>{dataSource.icon}</div>
          )}
          <Title className={styles.title} level={3}>
            {dataSource.name}
          </Title>
        </div>
        <Text>{t("text")}</Text>
        <Title level={5}>{t("title")}</Title>
        <SearchInput
          placeholder={t("common:words.find")}
          value={searchValue}
          onChange={(val) => setSearchValue(val.toLowerCase())}
        />
        <Spin spinning={loading}>
          <Form id="data-model-generation">
            {filteredSchema ? (
              <Collapse
                className={styles.collapse}
                expandIcon={() => <TableIcon />}
              >
                {Object.keys(filteredSchema).map((s) => {
                  const count = getCount(watch(), s);

                  return (
                    <Panel
                      className={styles.collapse}
                      header={
                        <span className={styles.collapseHeader}>
                          {s === "no_schema" ? t("common:words.no_schema") : s}
                          {count > 0 && <span>({count})</span>}
                        </span>
                      }
                      key={s}
                    >
                      <TableSelection
                        control={control}
                        type={watch("type")}
                        schema={filteredSchema}
                        path={s}
                        initialValue={initialValue}
                        smartGenTables={smartGenTables}
                        onSmartGenerate={onSmartGenerate}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            ) : (
              <Empty />
            )}

            <div className={styles.markupSelection}>
              <Title level={5}>{t("choose_markup")}</Title>

              <Input
                control={control}
                name="type"
                defaultValue={initialValue.type || "yaml"}
                fieldType="radio"
                optionType="button"
                options={options}
              />
            </div>

            <Row align="middle" justify={"space-between"}>
              <Col xs={24} md={18}>
                {(isOnboarding || !isGenerate) && (
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
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  form="data-model-generation"
                  onClick={handleSubmit((data) =>
                    onFormSubmit(data, data.type)
                  )}
                >
                  {t("common:words.generate")}
                </Button>
              </Col>

              {isOnboarding && (
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
      </div>
    </div>
  );
};

export default DataModelGeneration;
