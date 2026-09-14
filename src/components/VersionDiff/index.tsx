import cn from "classnames";
import { useTranslation } from "react-i18next";

import type { DiffHunk, DiffLineType } from "@/utils/helpers/versionDiff";

import styles from "./index.module.less";

import type { FC } from "react";

interface VersionDiffProps {
  hunks: DiffHunk[];
}

const signForType = (type: DiffLineType): string => {
  if (type === "add") {
    return "+";
  }

  if (type === "remove") {
    return "-";
  }

  return " ";
};

const VersionDiff: FC<VersionDiffProps> = ({ hunks }) => {
  const { t } = useTranslation(["models"], { useSuspense: false });

  if (!hunks.length) {
    return (
      <div className={styles.empty}>
        {t("models:version_diff.no_line_changes", {
          defaultValue: "No line changes",
        })}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {hunks.map((hunk) => (
        <div key={`hunk-${hunk.oldStart}-${hunk.newStart}`}>
          <div className={styles.hunkHeader}>
            {`@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${hunk.newCount} @@`}
          </div>
          {hunk.lines.map((line) => (
            <div
              key={`${line.type}-${line.oldNumber ?? "x"}-${
                line.newNumber ?? "x"
              }`}
              className={cn(styles.line, {
                [styles.add]: line.type === "add",
                [styles.remove]: line.type === "remove",
                [styles.equal]: line.type === "equal",
              })}
            >
              <span className={styles.oldNo}>{line.oldNumber ?? ""}</span>
              <span className={styles.newNo}>{line.newNumber ?? ""}</span>
              <span className={styles.sign}>{signForType(line.type)}</span>
              <span className={styles.text}>{line.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VersionDiff;
