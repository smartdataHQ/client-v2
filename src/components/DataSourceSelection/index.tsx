import { Col, Divider, Row, Select, Space, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
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

interface CopyFromOption {
  id: string;
  name: string;
  teamName: string;
  dbType: string;
}

interface DataSourceSelectionProps {
  options: DataSource[];
  initialValue?: DataSource;
  onSkip?: () => void;
  onSubmit?: (option: DataSource) => void;
  copyFromOptions?: CopyFromOption[];
  onCopyFrom?: (datasourceId: string) => void;
}

const DataSourceSelection: FC<DataSourceSelectionProps> = ({
  options,
  initialValue,
  onSkip,
  onSubmit,
  copyFromOptions = [],
  onCopyFrom,
}) => {
  const { t } = useTranslation(["dataSourceSelecton", "common"]);
  const windowSize = useResponsive();
  const isMobile = windowSize?.md !== true;
  const [ref, setRef] = useState<HTMLDivElement | null>();

  const tilesContainerSize = useSize(ref);
  const [keyword, setKeyword] = useState<string>("");
  const [selectedCopyDs, setSelectedCopyDs] = useState<string | null>(null);

  const tileWidth = useMemo(() => {
    if (tilesContainerSize?.width) {
      const tiles = Math.floor((tilesContainerSize.width + 2) / TILE_SIZE);
      const tilesPadding = (tiles - 1) * TILE_GAP;
      const width = (tilesContainerSize?.width - 2 - tilesPadding) / tiles;
      return Math.floor(width);
    }
  }, [tilesContainerSize?.width]);

  const handleCopy = () => {
    if (selectedCopyDs && onCopyFrom) {
      onCopyFrom(selectedCopyDs);
      setSelectedCopyDs(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Title level={3} style={{ marginTop: 0 }}>
        {t("title")}
      </Title>
      <Text>{t("text")}</Text>

      {copyFromOptions.length > 0 && onCopyFrom && (
        <>
          <Divider plain>
            <Text type="secondary">
              {t("common:words.or", "or copy from another team")}
            </Text>
          </Divider>
          <Space size={8} align="center" style={{ marginBottom: 16 }}>
            <Select
              style={{ minWidth: 280 }}
              placeholder={t(
                "common:words.select_datasource_to_copy",
                "Select a datasource to copy..."
              )}
              value={selectedCopyDs}
              onChange={setSelectedCopyDs}
              options={copyFromOptions.map((ds) => ({
                label: `${ds.name} (${ds.teamName})`,
                value: ds.id,
              }))}
              allowClear
              showSearch
              optionFilterProp="label"
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              disabled={!selectedCopyDs}
              onClick={handleCopy}
            >
              {t("common:words.copy", "Copy")}
            </Button>
          </Space>
        </>
      )}

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
