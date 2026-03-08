import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useResponsive, useSize } from "ahooks";

import SearchInput from "@/components/SearchInput";
import FormTile from "@/components/FormTile";
import Button from "@/components/Button";
import type { DataSource } from "@/types/dataSource";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;

const TILE_WIDTH = 103;
const TILE_GAP = 8 * 2;
const TILE_SIZE = TILE_WIDTH + TILE_GAP;

interface DataSourceSelectionProps {
  options: DataSource[];
  initialValue?: DataSource;
  onSkip?: () => void;
  onSubmit?: (option: DataSource) => void;
}

const DataSourceSelection: FC<DataSourceSelectionProps> = ({
  options,
  initialValue,
  onSkip,
  onSubmit,
}) => {
  const { t } = useTranslation(["dataSourceSelecton", "common"]);
  const windowSize = useResponsive();
  const isMobile = windowSize?.md !== true;
  const [ref, setRef] = useState<HTMLDivElement | null>();

  const tilesContainerSize = useSize(ref);
  const [keyword, setKeyword] = useState<string>("");

  const tileWidth = useMemo(() => {
    if (tilesContainerSize?.width) {
      const tiles = Math.floor((tilesContainerSize.width + 2) / TILE_SIZE);
      const tilesPadding = (tiles - 1) * TILE_GAP;
      const width = (tilesContainerSize?.width - 2 - tilesPadding) / tiles;
      return Math.floor(width);
    }
  }, [tilesContainerSize?.width]);

  return (
    <div className={styles.wrapper}>
      <Title level={3} style={{ marginTop: 0 }}>
        {t("title")}
      </Title>
      <Text>{t("text")}</Text>
      <Title level={5}>{t("subtitle")}</Title>
      <SearchInput
        value={keyword}
        onChange={setKeyword}
        placeholder={t("search_placeholder")}
      />
      <div className={styles.tilesWrapper} ref={(newRef) => setRef(newRef)}>
        <Row
          className={styles.tiles}
          gutter={[TILE_GAP, TILE_GAP]}
          justify={"start"}
        >
          {options
            .filter((db) =>
              db.name?.toLowerCase().includes(keyword.toLowerCase())
            )
            .map((tile) => (
              <Col className={styles.tile} key={tile.name}>
                <FormTile
                  width={tileWidth}
                  title={tile.name || ""}
                  icon={tile.icon}
                  active={initialValue?.value === tile.value}
                  deprecated={tile.deprecated}
                  onClick={() => onSubmit?.(tile)}
                />
              </Col>
            ))}
        </Row>
      </div>

      <Row align="middle" justify="end">
        {!!onSkip && (
          <Col
            xs={24}
            md={6}
            className={cn(styles.skip, {
              [styles.center]: isMobile,
            })}
          >
            <Button
              className={cn(styles.link, {
                [styles.fullwidth]: isMobile,
              })}
              type="link"
              onClick={onSkip}
            >
              {t("common:words.skip")}
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DataSourceSelection;
