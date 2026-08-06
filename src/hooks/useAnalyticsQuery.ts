import { useReducer, useCallback } from "react";
import { set, remove, getOr } from "unchanged";

import type { CubeMember } from "@/types/cube";
import type { PlaygroundState } from "@/types/exploration";
import type { SortBySet } from "@/components/VirtualTable";

import type { Reducer } from "react";

const defaultFilterValues = {
  time: {
    operator: "onTheDate",
  },
  string: {
    operator: "set",
  },
  number: {
    operator: "set",
  },
};

interface Action {
  type:
    | "add"
    | "addMany"
    | "update"
    | "setLimit"
    | "setOffset"
    | "setPage"
    | "setOrder"
    | "remove"
    | "removeMany"
    | "reset";
  [key: string]: any;
}

const applyAdd = (
  state: PlaygroundState,
  action: { memberType?: string; value: any; operatorType?: string }
): PlaygroundState => {
  let { memberType } = action;
  let { value } = action;

  if (memberType !== "filters") {
    const [memberName, granularity = null] = action?.value?.split(
      /\+/
    ) as string[];

    if (granularity) {
      memberType = "timeDimensions";
      value = {
        dimension: memberName,
        granularity,
      };
    }

    const slice = state[
      memberType as keyof PlaygroundState
    ] as unknown as CubeMember[];

    const isMemberExists = !!slice.find(
      (member) =>
        member.dimension?.name === memberName &&
        member.granularity === granularity
    );

    if (isMemberExists) {
      return state;
    }
  } else {
    value = {
      ...action.value,
      ...defaultFilterValues[
        action.operatorType as keyof typeof defaultFilterValues
      ],
    };
  }

  const elementsCount = getOr([], memberType, state).length;

  return set([memberType, elementsCount], value, state);
};

const applyRemove = (
  state: PlaygroundState,
  action: { memberType?: string; value: any; index?: number }
): PlaygroundState => {
  let { memberType } = action;
  let { index } = action;
  const { value } = action;

  if (memberType !== "filters") {
    const [memberName, granularity = null] = value?.split(/\+/);

    if (granularity) {
      memberType = "timeDimensions";
      const slice = state[memberType as keyof PlaygroundState] as CubeMember[];

      index = slice.findIndex(
        (member: CubeMember) =>
          member.dimension === memberName && member.granularity === granularity
      );
    } else if (index === undefined || index === null) {
      const slice = getOr([], memberType, state) as unknown[];
      index = slice.findIndex((member) => member === value);
    }
  }

  if (index === undefined || index === null || index < 0) {
    return state;
  }

  return remove([memberType, index], state);
};

const reducer: Reducer<PlaygroundState, Action> = (
  state: PlaygroundState,
  action: Action
) => {
  if (action.type === "add") {
    return applyAdd(state, action);
  }

  if (action.type === "addMany") {
    return (action.values || []).reduce(
      (acc: PlaygroundState, value: any) =>
        applyAdd(acc, {
          memberType: action.memberType,
          value,
          operatorType: action.operatorType,
        }),
      state
    );
  }

  if (action.type === "update") {
    return set([action.memberType, action.index], action.newValue, state);
  }

  if (action.type === "setLimit") {
    return {
      ...state,
      limit: parseInt(action.rowsLimit, 10),
    };
  }
  if (action.type === "setOffset") {
    return {
      ...state,
      offset: parseInt(action.value, 10),
    };
  }
  if (action.type === "setPage") {
    return {
      ...state,
      page: parseInt(action.value, 10),
    };
  }
  if (action.type === "setOrder") {
    const { value } = action;

    return set("order", value, state);
  }

  if (action.type === "remove") {
    return applyRemove(state, action);
  }

  if (action.type === "removeMany") {
    return (action.values || []).reduce(
      (acc: PlaygroundState, item: { value: any; index?: number }) =>
        applyRemove(acc, {
          memberType: action.memberType,
          value: item.value,
          // Resolve by name on each step so earlier removals do not shift indices
          index: undefined,
        }),
      state
    );
  }

  if (action.type === "reset") {
    return action.newState;
  }

  throw new Error(`Unknown action ${action.type}.`);
};

const queryBaseMembers = {
  measures: [],
  dimensions: [],
  filters: [],
  timeDimensions: [],
  segments: [],
};

export const queryState: PlaygroundState = {
  ...queryBaseMembers,
  order: [],
  timezone: "UTC",
  limit: 1000,
  offset: 0,
};

export const initialState: PlaygroundState = {
  ...queryState,
};

export const hasPlaygroundSelection = (state: PlaygroundState): boolean =>
  state.measures.length > 0 ||
  state.dimensions.length > 0 ||
  state.filters.length > 0 ||
  state.timeDimensions.length > 0 ||
  state.segments.length > 0;

const getName = (member: { name?: string }): any => member.name;

const getOperatorType = (member: CubeMember) =>
  getOr("", "dimension.type", member);

const useAnalyticsQuery = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateMember = useCallback(
    (memberType?: string, toQuery: (member: CubeMember) => any = getName) => ({
      add: (member: CubeMember) =>
        dispatch({
          type: "add",
          memberType,
          value: toQuery(member),
          operatorType: getOperatorType(member),
        }),
      addMany: (members: CubeMember[]) =>
        dispatch({
          type: "addMany",
          memberType,
          values: members.map(toQuery),
        }),
      remove: (member: CubeMember) =>
        dispatch({
          type: "remove",
          memberType,
          value: toQuery(member),
          index: member.index,
        }),
      removeMany: (members: CubeMember[]) =>
        dispatch({
          type: "removeMany",
          memberType,
          values: members.map((member) => ({
            value: toQuery(member),
            index: member.index,
          })),
        }),
      update: (member: CubeMember, newValue: any) =>
        dispatch({
          type: "update",
          memberType,
          index: member.index,
          newValue: toQuery(newValue),
        }),
    }),
    [dispatch]
  );

  const setLimit = useCallback(
    (rowsLimit: string | number) =>
      dispatch({ type: "setLimit", rowsLimit: rowsLimit || 1 }),
    [dispatch]
  );
  const setOffset = useCallback(
    (value: string | number) =>
      dispatch({ type: "setOffset", value: value || 0 }),
    [dispatch]
  );
  const setPage = useCallback(
    (value: string | number) => dispatch({ type: "setPage", value }),
    [dispatch]
  );
  const setOrderBy = useCallback(
    (value: SortBySet[]) => dispatch({ type: "setOrder", value }),
    [dispatch]
  );
  const doReset = useCallback(
    (newState: PlaygroundState) => dispatch({ type: "reset", newState }),
    [dispatch]
  );

  return {
    state,
    dispatch,
    updateMember,
    setLimit,
    setOffset,
    setPage,
    setOrderBy,
    doReset,
  };
};

export default useAnalyticsQuery;
