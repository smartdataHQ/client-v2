import { useMemo, useState, useEffect, useReducer } from "react";
import { useDeepCompareEffect } from "ahooks";

import useDataSourceMeta from "@/hooks/useDataSourcesMeta";
import useAnalyticsQuery, {
  queryState,
  initialState,
} from "@/hooks/useAnalyticsQuery";
import useExplorationData from "@/hooks/useExplorationData";
import pickKeys from "@/utils/helpers/pickKeys";
import equals from "@/utils/helpers/equals";
import type { CubeMembers } from "@/types/cube";
import type { QuerySettings } from "@/types/querySettings";
import type {
  ExplorationData,
  ExplorationState,
  PlaygroundState,
  RawSql,
} from "@/types/exploration";

import type { Reducer } from "react";

export const queryStateKeys = Object.keys(queryState);

const initialSettings: QuerySettings = {
  hideCubeNames: false,
  hideIndexColumn: false,
};

interface UpdateAction {
  type: "update";
  value: QuerySettings;
}

interface HideCubeNamesAction {
  type: "hideCubeNames";
  value: boolean;
}

interface HideIndexAction {
  type: "hideIndexColumn";
  value: boolean;
}

type Action = UpdateAction | HideCubeNamesAction | HideIndexAction;

const reducer: Reducer<QuerySettings, Action> = (
  state,
  action
): QuerySettings => {
  if (action.type === "hideCubeNames") {
    return {
      ...state,
      hideCubeNames: action.value,
    };
  }
  if (action.type === "hideIndexColumn") {
    return {
      ...state,
      hideIndexColumn: action.value,
    };
  }
  if (action.type === "update") {
    return action.value;
  }

  return state;
};

export const getColumns = (selectedQueryMembers: CubeMembers) =>
  [
    ...Object.values(selectedQueryMembers.dimensions || {}).map((d) => ({
      ...d,
      name: d.granularity ? `${d.dimension}.${d.granularity}` : d.name,
    })),
    ...Object.values(selectedQueryMembers.measures || {}),
  ].map((c) => ({
    id: c.name,
    Header: c.shortTitle ?? c.title ?? c.name,
    fullTitle: c.title ?? c.name,
    accessor: (row: any) => row[c.name],
    colId: c.name,
    type: c.type,
  }));

interface Props {
  meta?: Record<string, any>[];
  explorationData?: ExplorationData;
  rawSql?: RawSql;
  dataset?: any;
}

export default ({ meta = [], explorationData, rawSql }: Props) => {
  const { exploration, dataset } = explorationData || {};
  const [settings, dispatchSettings] = useReducer(reducer, initialSettings);

  const playgroundSettings = useMemo(
    () => exploration?.playground_settings || {},
    [exploration]
  );

  useDeepCompareEffect(() => {
    dispatchSettings({
      type: "update",
      value: playgroundSettings as QuerySettings,
    });
  }, [playgroundSettings]);

  const {
    state: currPlaygroundState,
    dispatch,
    updateMember,
    setLimit,
    setOffset,
    setPage,
    setOrderBy,
    doReset,
  } = useAnalyticsQuery();

  const { selectedQueryMembers, availableQueryMembers } = useDataSourceMeta({
    meta,
    playgroundState: currPlaygroundState,
  });

  const { rows, hitLimit, skippedMembers } = useExplorationData({
    explorationResult: dataset,
  });

  const columns: object[] = useMemo(() => {
    if (!selectedQueryMembers) {
      return [];
    }

    return getColumns(selectedQueryMembers);
  }, [selectedQueryMembers]);

  const explorationState: ExplorationState = useMemo(
    () => ({
      progress: dataset?.progress,
      hitLimit,
      columns,
      rows,
      ...currPlaygroundState,
      rawSql,
      skippedMembers,
      settings,
    }),
    [
      dataset?.progress,
      rawSql,
      hitLimit,
      columns,
      rows,
      currPlaygroundState,
      skippedMembers,
      settings,
    ]
  );

  const [isQueryChanged, setChangedStatus] = useState(false);

  useEffect(() => {
    const playgroundState = exploration?.playground_state || queryState;

    const isChanged = !equals(
      pickKeys(queryStateKeys, playgroundState),
      pickKeys(queryStateKeys, currPlaygroundState)
    );

    if (isQueryChanged !== isChanged) {
      setChangedStatus(isChanged);
    }
  }, [isQueryChanged, currPlaygroundState, exploration]);

  useEffect(() => {
    const newState = exploration?.playground_state;

    if (newState) {
      doReset(newState as unknown as PlaygroundState);
    }
  }, [exploration?.playground_state, doReset]);

  useEffect(() => {
    if (!exploration?.id) {
      doReset(initialState);
    }
  }, [exploration?.id, doReset]);

  return {
    state: explorationState,
    selectedQueryMembers,
    availableQueryMembers,
    analyticsQuery: {
      state: currPlaygroundState,
      dispatch,
      updateMember,
      isQueryChanged,
      setLimit,
      setOffset,
      setPage,
      setOrderBy,
    },
    settings,
    dispatchSettings,
  };
};
