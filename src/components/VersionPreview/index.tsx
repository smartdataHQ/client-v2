import { Badge, Col, Row, Space, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";

import MdIcon from "@/assets/md.svg";
import RestoreIcon from "@/assets/restore.svg";

import styles from "./index.module.less";

import type { FC } from "react";

interface VersionPreviewProps {
  version?: string;
  count?: number;
  href?: string;
  onRestore?: () => void;
}

const VersionPreview: FC<VersionPreviewProps> = ({
  version,
  count = 0,
  href,
  onRestore = () => {},
}) => {
  const { t } = useTranslation(["common"]);
  return (
    <Row className={styles.wrapper} align={"middle"}>
      {version && (
        <Col className={styles.version} span={16}>
          <span className={styles.label}>{t("common:words.version")}:</span>{" "}
          <Tooltip placement="topLeft" title={version}>
            <span className={styles.text}>{version}</span>
          </Tooltip>
        </Col>
      )}
      <Col className={styles.count} span={8}>
        <Space size={6}>
          <Tooltip title={t("common:words.docs")}>
            <Button
              className={styles.btn}
              icon={<MdIcon />}
              target="_blank"
              href={href}
            />
          </Tooltip>
          <Tooltip title={t("common:words.versions")}>
            <Badge
              count={count}
              color="#4a7faa"
              style={{
                fontSize: 8,
              }}
              size="small"
            >
              <Button
                className={styles.btn}
                icon={<RestoreIcon />}
                onClick={onRestore}
              />
            </Badge>
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
};

export default VersionPreview;
