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
    | "update"
    | "update"
    | "setLimit"
    | "setOffset"
    | "setPage"
    | "setOrder"
    | "remove"
    | "reset";
  [key: string]: any;
}
const reducer: Reducer<PlaygroundState, Action> = (
  state: PlaygroundState,
  action: Action
) => {
  let { memberType } = action;

  if (action.type === "add") {
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
    let { index } = action;
    const { value } = action;

    if (memberType !== "filters") {
      const [memberName, granularity = null] = value?.split(/\+/);

      if (granularity) {
        memberType = "timeDimensions";
        const slice = state[
          memberType as keyof PlaygroundState
        ] as CubeMember[];

        index = slice.findIndex(
          (member: CubeMember) =>
            member.dimension === memberName &&
            member.granularity === granularity
        );
      }
    }

    return remove([memberType, index], state);
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
  limit: 100,
  offset: 0,
};

export const initialState: PlaygroundState = {
  ...queryState,
};

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
      remove: (member: CubeMember) =>
        dispatch({
          type: "remove",
          memberType,
          value: toQuery(member),
          index: member.index,
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
