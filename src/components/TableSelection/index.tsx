import { useResponsive } from "ahooks";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Checkbox } from "antd";
import cn from "classnames";

import Button from "@/components/Button";
import type { DynamicForm, Schema } from "@/types/dataSource";

import styles from "./index.module.less";

import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { Control } from "react-hook-form";
import type { FC } from "react";

interface TableSelectionProps {
  schema: Schema;
  path: string;
  type: string;
  control: Control<DynamicForm>;
  initialValue?: DynamicForm;
}

const TableSelection: FC<TableSelectionProps> = ({
  schema,
  path,
  control,
  initialValue,
  type,
}) => {
  const windowSize = useResponsive();
  const { t } = useTranslation(["common"]);

  const {
    field: { onChange, value },
  } = useController({
    name: path,
    control,
    defaultValue: initialValue,
  });

  const isAllSelected = () =>
    Object.keys(schema[path]).every((tb) => value[tb] === true);

  const onClear = () => {
    const newVal: DynamicForm = {};
    Object.keys(value).forEach((k) => (newVal[k] = false));
    onChange(newVal);
  };

  const onSelectAll = (e: CheckboxChangeEvent) => {
    if (!e.target.checked) return onClear();
    const newVal: DynamicForm = {};
    Object.keys(schema[path]).forEach((tb) => (newVal[tb] = true));
    onChange(newVal);
  };

  return (
    <div>
      <div className={styles.header}>
        <Checkbox checked={isAllSelected()} onChange={onSelectAll}>
          {t("common:words.select_all")}
        </Checkbox>
        <Button onClick={onClear} type="link">
          {t("common:words.clear")}
        </Button>
      </div>
      {Object.keys(schema[path]).map((tb) => (
        <div key={tb}>
          <div className={cn(styles.field)}>
            <Checkbox
              checked={value?.[tb]}
              onChange={(e) => {
                onChange({ ...value, [tb]: e.target.checked });
              }}
            >
              <span
                className={cn(styles.table, {
                  [styles.column]: !windowSize.md,
                })}
              >
                <span>{tb}</span>
                <span className={styles.separator}>→</span>
                <span>
                  {tb}.{type}
                </span>
              </span>
            </Checkbox>
            <span
              className={cn(styles.columns, {
                [styles.block]: !windowSize.md,
              })}
            >
              ({schema[path][tb].length}) {t("common:words.columns")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableSelection;
