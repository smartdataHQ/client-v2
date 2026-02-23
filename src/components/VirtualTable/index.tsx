import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  ColumnWidthOutlined,
  HolderOutlined,
  MoreOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { getOr } from "unchanged";
import cn from "classnames";
import { Alert, Button, Empty, Spin, Tooltip, Typography, message } from "antd";
import { useTable, useSortBy } from "react-table";
import copy from "copy-to-clipboard";
import {
  Column,
  Table,
  SortDirection,
  defaultTableCellRenderer,
} from "react-virtualized";
import "react-virtualized/styles.css";

import PopoverButton from "@/components/PopoverButton";
import type { ErrorMessage } from "@/types/errorMessage";
import type { SortBy } from "@/types/sort";
import type { QuerySettings } from "@/types/querySettings";

const { Paragraph } = Typography;

import styles from "./index.module.less";

import type { OrderByFn } from "react-table";
import type {
  ScrollEventData,
  TableCellDataGetter,
  TableCellProps,
  TableCellRenderer,
  TableHeaderRenderer,
} from "react-virtualized";
import type { FC, ReactNode } from "react";
import type { MenuProps } from "antd";

const COL_WIDTH = 200;
const INDEX_COL_WIDTH = 70;
const MIN_COL_WIDTH = 100;
const PX_PER_CHAR = 8;
const HEADER_PADDING = 32;

// set with unique ids inside https://stackoverflow.com/a/49821454
export class SortBySet extends Set {
  reverseUniq(byKey: string) {
    const presentKeys: string[] = [];

    [...this.values()].reverse().forEach((value) => {
      if (presentKeys.includes(value[byKey])) {
        this.delete(value);
      } else {
        presentKeys.push(value[byKey]);
      }
    });
  }
}

export const cellRenderer = (args: TableCellProps, membersIndex: any) => {
  const { cellData, dataKey } = args;

  const format = membersIndex?.[dataKey]?.format;
  const meta = membersIndex?.[dataKey]?.meta;

  if (
    format?.toString().toLowerCase() === "link" ||
    format?.type?.toString()?.toLowerCase() === "link"
  ) {
    const label = typeof format === "object" ? format?.label : null;

    return (
      <a href={cellData?.toString()} target="_blank" rel="noopener noreferrer">
        {label?.toString() || cellData?.toString()}
      </a>
    );
  }

  if (
    format?.toString().toLowerCase() === "currency" ||
    format?.type?.toString()?.toLowerCase() === "currency"
  ) {
    const symbol = typeof meta === "object" ? meta?.currencySymbol : null;

    return (
      <>
        <span>{!!cellData?.toString() && (symbol || "$")}</span>
        <span>{cellData?.toString()}</span>
      </>
    );
  }

  if (format?.toString().toLowerCase() === "imageUrl") {
    return (
      <a href={cellData?.toString()} target="_blank" rel="noopener noreferrer">
        <img src={cellData.toString()} alt={cellData.toString()} />
      </a>
    );
  }

  if (format?.toString().toLowerCase() === "percent") {
    return (
      <>
        <span>{cellData?.toString()}</span>
        <span>{!!cellData?.toString() && "%"}</span>
      </>
    );
  }

  if (format?.toString().toLowerCase() === "id") {
    return <i>{cellData?.toString()}</i>;
  }

  return defaultTableCellRenderer(args);
};

interface VirtualTableProps {
  sortBy?: SortBy[];
  messages?: ErrorMessage[];
  onSortUpdate?: (nextSortBy: SortBySet[]) => void;
  data?: object[];
  columns?: object[];
  width?: number;
  height?: number;
  headerHeight?: number;
  rowHeight?: number;
  loading?: boolean;
  loadingTip?: string;
  emptyDesc?: ReactNode;
  emptyComponent?: ReactNode;
  orderByFn?: OrderByFn<object>;
  footer?: (rows: object[]) => void;
  sortDisabled?: boolean;
  scrollToIndex?: number;
  cellRenderer?: TableCellRenderer;
  onScroll?: (params: { rowHeight: number } & ScrollEventData) => void;
  tableId?: string;
  className?: string;
  settings?: QuerySettings;
  sortinMode?: "client-side" | "server-side";
  showAutoSizeButton?: boolean;
  toolbarExtra?: ReactNode;
}

const VirtualTable: FC<VirtualTableProps> = ({
  sortBy = [],
  columns: userColumns,
  data = [],
  width = 300,
  height = 300,
  headerHeight = 30,
  rowHeight = 30,
  emptyDesc = "No Data",
  emptyComponent,
  onSortUpdate = () => {},
  messages = [],
  sortDisabled = false,
  scrollToIndex = 0,
  tableId,
  cellRenderer: defaultCellRenderer = defaultTableCellRenderer,
  settings: { hideIndexColumn } = {
    hideIndexColumn: false,
  },
  className,
  onScroll,
  footer,
  orderByFn,
  loading,
  loadingTip,
  sortinMode = "client-side",
  showAutoSizeButton = true,
  toolbarExtra,
}) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [tableKey, setTableKey] = useState(0);
  const resizeRef = useRef<{
    colId: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const getColumnWidth = useCallback(
    (colId: string) =>
      Math.max(MIN_COL_WIDTH, columnWidths[colId] ?? COL_WIDTH),
    [columnWidths]
  );

  const onResizeStart = useCallback(
    (colId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resizeRef.current = {
        colId,
        startX: e.clientX,
        startWidth: getColumnWidth(colId),
      };
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [getColumnWidth]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const { colId, startX, startWidth } = resizeRef.current;
      const newWidth = Math.max(MIN_COL_WIDTH, startWidth + e.clientX - startX);
      setColumnWidths((prev) => ({ ...prev, [colId]: newWidth }));
    };
    const onMouseUp = () => {
      if (resizeRef.current) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setTableKey((k) => k + 1);
      }
      resizeRef.current = null;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const defaultColumns = useMemo(
    () =>
      Object.keys(getOr({}, 0, data)).map((colId) => {
        const col: any = {
          Header: colId,
          accessor: (row: any) => row[colId],
          id: colId,
        };

        if (orderByFn) col.sortType = orderByFn;
        return col;
      }),
    [data, orderByFn]
  );

  const columns: any = userColumns || defaultColumns;

  const {
    rows,
    flatHeaders,
    state,
    //@ts-ignore
    setSortBy,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const autoSizeColumns = useCallback(() => {
    if (flatHeaders.length === 0) return;
    const HEADER_EXTRA = 48;
    const newWidths: Record<string, number> = {};
    const rawRows = data || [];
    const hasNoRows = rawRows.length === 0;
    flatHeaders.forEach((col) => {
      const headerStr = typeof col.Header === "string" ? col.Header : col.id;
      const headerWidth =
        String(headerStr).length * PX_PER_CHAR + HEADER_PADDING + HEADER_EXTRA;
      let maxDataWidth = 0;
      rawRows.forEach((row: any) => {
        const val = row?.[col.id];
        const str =
          typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
        const len = Math.min(str.length, 100);
        maxDataWidth = Math.max(
          maxDataWidth,
          len * PX_PER_CHAR + HEADER_PADDING
        );
      });
      const baseWidth = Math.max(headerWidth, maxDataWidth);
      newWidths[col.id] = Math.max(
        MIN_COL_WIDTH,
        hasNoRows ? Math.ceil(headerWidth * 1.15) : baseWidth
      );
    });
    setColumnWidths(newWidths);
    setTableKey((k) => k + 1);
    message.success("Columns auto-sized");
  }, [flatHeaders, data]);

  const headerRenderer: TableHeaderRenderer = ({ label, columnData }) => {
    const { sortDirection, onSortChange, columnId, granularity } = columnData;
    const fullTitle = (columnData as any).fullTitle;
    const tooltipTitle =
      fullTitle ?? (granularity ? `${label} (by ${granularity})` : label);
    const shortLabel = typeof label === "string" ? label : String(label ?? "");

    const children = [
      <Tooltip key="label" title={tooltipTitle}>
        <Paragraph ellipsis className={styles.headerParagraph}>
          {shortLabel}
        </Paragraph>
      </Tooltip>,
    ];

    let icon = <MoreOutlined />;

    if (sortDirection) {
      icon =
        sortDirection === SortDirection.DESC ? (
          <SortDescendingOutlined />
        ) : (
          <SortAscendingOutlined />
        );
    }

    const onClickSort = (sortDir: string | null) => {
      onSortChange(sortDir, columnId);
    };

    const routes: MenuProps["items"] = [
      {
        key: "1",
        onClick: () => onClickSort(SortDirection.ASC),
        label: "Sort ASC",
      },
      {
        key: "2",
        onClick: () => onClickSort(SortDirection.DESC),
        label: "Sort DESC",
      },
      {
        key: "3",
        onClick: () => onClickSort(null),
        label: "Don't sort",
      },
    ];

    if (!sortDisabled) {
      children.push(
        <PopoverButton
          key="dropdown"
          popoverType="dropdown"
          buttonProps={{
            type: "link",
            className: styles.dropdownBtn,
          }}
          icon={icon}
          trigger={["click"]}
          menu={{ items: routes }}
        />
      );
    }

    const dataKey = (columnData as any).dataKey ?? columnId;
    children.push(
      <div
        key="resize"
        className={styles.columnResizeHandle}
        title="Drag to resize"
        onMouseDown={(e) => onResizeStart(dataKey, e)}
      >
        <HolderOutlined />
      </div>
    );

    return children;
  };

  const cellDataGetter: TableCellDataGetter = ({ rowData, dataKey }) => {
    let val = rowData?.original?.[dataKey];

    if (typeof val === "object") {
      try {
        val = JSON.stringify(val);
      } catch (err) {
        console.error(`Can't stringify "${dataKey}" value: ${val}`);
        console.error(err);
      }
    }

    return val;
  };

  const onSortChange = (direction: string, columnId: string) => {
    let sortBySet: SortBySet;
    if (sortinMode === "client-side") {
      //@ts-ignore
      sortBySet = new SortBySet(state.sortBy);
    } else {
      sortBySet = new SortBySet(sortBy);
    }

    if (direction) {
      sortBySet.add({
        id: columnId,
        desc: direction === SortDirection.DESC,
      });

      sortBySet.reverseUniq("id");
    } else {
      sortBySet.forEach((value) => {
        if (value.id === columnId) {
          sortBySet.delete(value);
        }
      });
    }

    const nextSortBy = [...sortBySet];
    onSortUpdate(nextSortBy);

    if (sortinMode === "client-side") {
      return setSortBy(nextSortBy);
    }
  };

  const noRowsRenderer = () => {
    return (
      <div className={styles.noRows} style={{ height: rowHeight }}>
        No rows
      </div>
    );
  };

  const internalCellRenderer: TableCellRenderer = (args) => {
    const { cellData } = args;

    const onDoubleClick = () => {
      const copied = copy(cellData);

      if (copied) {
        message.success("Column value copied to the clipboard");
      }
    };

    return (
      <span title={cellData?.toString()} onDoubleClick={onDoubleClick}>
        {defaultCellRenderer(args)}
      </span>
    );
  };

  const isEmpty = !columns.length && !rows.length;
  const tableWidth = useMemo(() => {
    let tw = flatHeaders.reduce((sum, col) => sum + getColumnWidth(col.id), 0);
    if (!hideIndexColumn) tw += INDEX_COL_WIDTH;
    return tw;
  }, [flatHeaders, getColumnWidth, hideIndexColumn]);

  const defaultEmptyComponent = (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyDesc} />
  );

  return (
    <Spin spinning={loading} tip={loadingTip}>
      {isEmpty ? (
        emptyComponent || defaultEmptyComponent
      ) : (
        <>
          {messages.map((msg) => (
            <Alert
              className={styles.alert}
              key={msg.text}
              type={msg.type}
              message={msg.text}
            />
          ))}
          <div
            className={cn(className)}
            style={{
              width: `min(100%, ${width})`,
              height: height + 10,
            }}
          >
            {(showAutoSizeButton || toolbarExtra) && (
              <div className={styles.toolbar}>
                {showAutoSizeButton && (
                  <Button
                    type="default"
                    size="small"
                    icon={<ColumnWidthOutlined />}
                    onClick={autoSizeColumns}
                  >
                    Auto-size columns
                  </Button>
                )}
                {toolbarExtra}
              </div>
            )}
            <div className={styles.tableWrapper} role="table">
              <Table
                key={`${tableWidth}-${tableKey}`}
                id={tableId}
                className={cn(styles.table, tableId && styles.minWidth)}
                width={tableWidth}
                height={height}
                headerHeight={headerHeight}
                rowHeight={rowHeight}
                rowCount={rows.length}
                rowGetter={({ index }) => rows[index]}
                rowStyle={({ index }) => ({
                  background: index % 2 ? "rgba(249, 249, 249, 1)" : "none",
                })}
                noRowsRenderer={noRowsRenderer}
                overscanRowCount={3}
                onScroll={(values) => onScroll?.({ ...values, rowHeight })}
                scrollToAlignment="start"
                scrollToIndex={scrollToIndex}
              >
                {!hideIndexColumn && (
                  <Column
                    className={styles.indexColumn}
                    label="#"
                    cellDataGetter={({ rowData }) => rowData.index + 1}
                    cellRenderer={({ cellData }) => (
                      <div className={styles.indexCell}>{cellData}</div>
                    )}
                    dataKey="index"
                    width={INDEX_COL_WIDTH}
                    flexGrow={0}
                    flexShrink={0}
                  />
                )}
                {flatHeaders.map((col) => {
                  const [cube, field, granularity] = col.id.split(".");
                  const columnMemberId = `${cube}.${field}`;

                  const value = col.render("Header");
                  const fullTitle = (col as any).fullTitle ?? value;

                  const colSortConfig =
                    sortBy.find((sortItem) => sortItem.id === columnMemberId) ||
                    //@ts-ignore
                    state.sortBy.find(
                      (sortItem) => sortItem.id === columnMemberId
                    );

                  const sortDirection =
                    !!colSortConfig &&
                    ((colSortConfig.desc && SortDirection.DESC) ||
                      SortDirection.ASC);
                  return (
                    <Column
                      key={col.id}
                      label={value}
                      dataKey={col.id}
                      width={getColumnWidth(col.id)}
                      flexGrow={0}
                      flexShrink={0}
                      headerRenderer={headerRenderer}
                      cellDataGetter={cellDataGetter}
                      cellRenderer={internalCellRenderer}
                      columnData={{
                        columnId: columnMemberId,
                        dataKey: col.id,
                        fullTitle,
                        onSortChange,
                        sortDirection,
                        granularity,
                      }}
                    />
                  );
                })}
              </Table>
            </div>
          </div>
          {footer?.(rows)}
        </>
      )}
    </Spin>
  );
};

export default VirtualTable;
