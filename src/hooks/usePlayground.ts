import { useMemo, useState, useEffect, useReducer, useCallback } from "react";
import { useDeepCompareEffect } from "ahooks";

import useDataSourceMeta from "@/hooks/useDataSourcesMeta";
import useFilterParams from "@/hooks/useFilterParams";
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

  const { requiredParams } = useFilterParams({
    availableQueryMembers: availableQueryMembers || {},
    playgroundState: currPlaygroundState,
  });

  // Selector state: tracks chosen value for each FILTER_PARAMS lookup key.
  // Selectors are NOT filters — they select which nested structure element to read
  // (e.g. classification_type="Category" picks the Category row from the array).
  // At query time, selector values are merged into the Cube.js filters array
  // since that's how FILTER_PARAMS substitution works under the hood.
  const [selectorValues, setSelectorValues] = useState<Record<string, string>>(
    {}
  );
  const [selectorDirty, setSelectorDirty] = useState(false);

  const setSelectorValue = useCallback(
    (dimensionName: string, value: string) => {
      setSelectorValues((prev) => ({ ...prev, [dimensionName]: value }));
      setSelectorDirty(true);
    },
    []
  );

  // Auto-initialize selectors with first known value when new ones appear.
  // indexOf() requires a real string value — the FILTER_PARAMS fallback (1=1)
  // causes a ClickHouse type error, so selectors must always have a value set.
  useEffect(() => {
    if (requiredParams.length === 0) return;

    setSelectorValues((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const param of requiredParams) {
        if (!(param.name in next)) {
          const knownValues = Array.isArray(param.meta?.known_values)
            ? param.meta.known_values
            : [];
          next[param.name] = knownValues[0] || "";
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [requiredParams]);

  // Clean up selector values for params that are no longer required
  useEffect(() => {
    const requiredNames = new Set(requiredParams.map((p) => p.name));
    setSelectorValues((prev) => {
      const next: Record<string, string> = {};
      let changed = false;
      for (const [key, val] of Object.entries(prev)) {
        if (requiredNames.has(key)) {
          next[key] = val;
        } else {
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [requiredParams]);

  // Build the selector filters to merge into the query at execution time
  const selectorFilters = useMemo(
    () =>
      requiredParams
        .filter((p) => selectorValues[p.name])
        .map((p) => ({
          dimension: p.name,
          operator: "equals" as const,
          values: [selectorValues[p.name]],
        })),
    [requiredParams, selectorValues]
  );

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

    if (isQueryChanged !== (isChanged || selectorDirty)) {
      setChangedStatus(isChanged || selectorDirty);
    }
  }, [isQueryChanged, currPlaygroundState, exploration, selectorDirty]);

  useEffect(() => {
    const newState = exploration?.playground_state;

    if (newState) {
      doReset(newState as unknown as PlaygroundState);
      setSelectorDirty(false);
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
    selectors: {
      requiredParams,
      selectorValues,
      setSelectorValue,
      selectorFilters,
    },
  };
};
