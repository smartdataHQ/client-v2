import { Badge } from "antd";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";

import { formatCompileErrors } from "@/utils/helpers/formatCompileErrors";
import type { FormattedCompileError } from "@/utils/helpers/formatCompileErrors";

import CloseIcon from "@/assets/console-close.svg";

import s from "./index.module.less";

import type { FC } from "react";

export interface ConsoleError {
  severity: "error" | "warning";
  message: string;
  cube?: string;
  path?: string;
  allowed?: string[];
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
  return formatCompileErrors(errors);
}

function ErrorCard({
  item,
  onGoToLine,
}: {
  item: ConsoleError | FormattedCompileError;
  onGoToLine?: (line: number, column?: number) => void;
}) {
  const line = "line" in item ? item.line : null;
  const column = "column" in item ? item.column : null;
  const clickable = !!line;

  return (
    <div
      className={clickable ? `${s.errorCard} ${s.clickable}` : s.errorCard}
      onClick={() => line && onGoToLine?.(line, column ?? 1)}
    >
      <div className={s.errorCardIcon}>
        {item.severity === "error" ? (
          <ExclamationCircleOutlined className={s.errorIcon} />
        ) : (
          <WarningOutlined className={s.warningIcon} />
        )}
      </div>
      <div className={s.errorCardBody}>
        {(item.cube || item.path || line) && (
          <div className={s.errorMeta}>
            {item.cube && <span className={s.cubeName}>{item.cube}</span>}
            {item.path && <span className={s.fieldPath}>{item.path}</span>}
            {line ? <span className={s.lineRef}>Ln {line}</span> : null}
          </div>
        )}
        <div className={s.errorMessage}>{item.message}</div>
        {item.allowed && item.allowed.length > 0 && (
          <div className={s.allowedBlock}>
            <div className={s.allowedLabel}>Allowed values</div>
            <div className={s.allowedList}>
              {item.allowed.map((value) => (
                <code key={value} className={s.allowedChip}>
                  {value}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
          <div className={s.errorList}>
            {items.map((item, index) => (
              <ErrorCard
                key={`${item.cube || ""}-${item.path || ""}-${
                  item.message
                }-${index}`}
                item={item}
                onGoToLine={onGoToLine}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;
