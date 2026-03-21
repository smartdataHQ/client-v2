import { Badge, List } from "antd";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";

import CloseIcon from "@/assets/console-close.svg";

import s from "./index.module.less";

import type { FC } from "react";

export interface ConsoleError {
  severity: "error" | "warning";
  message: string;
  line?: number | null;
  column?: number | null;
  fileName?: string | null;
}

interface ConsoleProps {
  errors: string | ConsoleError[];
  onClose: () => void;
  onGoToLine?: (line: number, column?: number) => void;
}

function parseErrors(errors: string | ConsoleError[]): ConsoleError[] {
  if (Array.isArray(errors)) return errors;
  if (!errors || !errors.trim()) return [];
  return [{ severity: "error", message: errors }];
}

const Console: FC<ConsoleProps> = ({ errors, onClose, onGoToLine }) => {
  const items = parseErrors(errors);
  const errorCount = items.filter((e) => e.severity === "error").length;
  const warningCount = items.filter((e) => e.severity === "warning").length;

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.tabBtn}>
          {errorCount > 0 && (
            <Badge count={errorCount} size="small" style={{ marginRight: 8 }} />
          )}
          Errors
          {warningCount > 0 && (
            <span className={s.warningCount}>{warningCount} warnings</span>
          )}
        </div>
        <CloseIcon
          className={s.closeButton}
          data-testid="close-console"
          onClick={onClose}
        />
      </div>
      <div className={s.body}>
        {items.length === 0 ? (
          <div className={s.noErrors}>No issues found</div>
        ) : (
          <List
            size="small"
            split={false}
            dataSource={items}
            renderItem={(item) => (
              <List.Item className={s.errorItem}>
                {item.severity === "error" ? (
                  <ExclamationCircleOutlined className={s.errorIcon} />
                ) : (
                  <WarningOutlined className={s.warningIcon} />
                )}
                <span
                  className={item.line ? s.clickableLine : undefined}
                  onClick={() =>
                    item.line && onGoToLine?.(item.line, item.column ?? 1)
                  }
                >
                  {item.line ? `Ln ${item.line}: ` : ""}
                  {item.message}
                </span>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Console;
