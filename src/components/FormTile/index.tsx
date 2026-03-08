import { Card, Tag } from "antd";
import cn from "classnames";

import styles from "./index.module.less";

import type { FC, ReactNode } from "react";

interface FormTileProps {
  width?: number;
  title: string;
  icon: ReactNode;
  onClick?: (title: string) => void;
  active?: boolean;
  deprecated?: boolean;
}

const FormTile: FC<FormTileProps> = ({
  width,
  title,
  icon,
  onClick,
  active = false,
  deprecated = false,
}) => {
  return (
    <div className={styles.wrapper} style={{ width }}>
      <Card
        className={styles.card}
        bodyStyle={{ padding: 10 }}
        style={{ background: "#F9F9F9", position: "static" }}
        onClick={() => onClick?.(title)}
        hoverable
      >
        {deprecated && (
          <Tag
            color="warning"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              fontSize: 10,
              margin: 0,
              lineHeight: "16px",
              padding: "0 4px",
            }}
          >
            Deprecated
          </Tag>
        )}
        <div
          className={cn(styles.iconWrapper, {
            [styles.active]: active,
          })}
        >
          {icon}
        </div>
        <span
          className={cn(styles.title, {
            [styles.active]: active,
          })}
        >
          {title}
        </span>
      </Card>
    </div>
  );
};

export default FormTile;
