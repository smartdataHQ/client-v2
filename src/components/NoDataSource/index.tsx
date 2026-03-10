import { Typography, Space } from "antd";
import { useTranslation } from "react-i18next";

import NoDataSourceImg from "@/assets/no-db.png";
import Button from "@/components/Button";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;

interface NoDataSourceProps {
  onConnect?: () => void;
  compact?: boolean;
}

const NoDataSource: FC<NoDataSourceProps> = ({
  onConnect,
  compact = false,
}) => {
  const { t } = useTranslation(["settings", "common"], { useSuspense: false });

  if (compact) {
    return (
      <div className={styles.compact}>
        <Text>{t("data_sources.not_found.title")}</Text>
        {onConnect && (
          <Button size="small" type="primary" onClick={onConnect}>
            {t("data_sources.not_found.connect_btn")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <img className={styles.img} src={NoDataSourceImg} alt="" />
      <Title level={4}>{t("data_sources.not_found.title")}</Title>
      {onConnect && (
        <>
          <Text className={styles.text}>
            {t("data_sources.not_found.text")}
          </Text>
          <Button size="large" type="primary" onClick={onConnect}>
            {t("data_sources.not_found.connect_btn")}
          </Button>
        </>
      )}
    </div>
  );
};

export default NoDataSource;
