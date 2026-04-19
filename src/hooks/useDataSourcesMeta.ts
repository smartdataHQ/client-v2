import { useMemo } from "react";
import { getOr } from "unchanged";

import fromPairs from "@/utils/helpers/fromPairs";
import type { CubeMember, CubeMembers } from "@/types/cube";
import type { PlaygroundState } from "@/types/exploration";

const operators = {
  string: [
    { name: "contains", title: "contains" },
    { name: "notContains", title: "does not contain" },
    { name: "equals", title: "equals" },
    { name: "notEquals", title: "does not equal" },
    { name: "set", title: "is set" },
    { name: "notSet", title: "is not set" },
  ],
  number: [
    { name: "equals", title: "equals" },
    { name: "notEquals", title: "does not equal" },
    { name: "set", title: "is set" },
    { name: "notSet", title: "is not set" },
    { name: "gt", title: ">" },
    { name: "gte", title: ">=" },
    { name: "lt", title: "<" },
    { name: "lte", title: "<=" },
  ],
  time: [
    { name: "inDateRange", title: "is in range of" },
    { name: "notInDateRange", title: "is not in range of" },
    { name: "onTheDate", title: "on the date" },
    { name: "beforeDate", title: "before date" },
    { name: "afterDate", title: "after date" },
    { name: "set", title: "is set" },
    { name: "notSet", title: "is not set" },
  ],
  boolean: [
    { name: "equals", title: "equals" },
    { name: "notEquals", title: "does not equal" },
    { name: "set", title: "is set" },
    { name: "notSet", title: "is not set" },
  ],
  geo: [
    { name: "contains", title: "contains" },
    { name: "notContains", title: "does not contain" },
    { name: "equals", title: "equals" },
    { name: "notEquals", title: "does not equal" },
    { name: "set", title: "is set" },
    { name: "notSet", title: "is not set" },
  ],
};

export const granularities = [
  { name: undefined, title: "Raw" },
  { name: "second", title: "Second" },
  { name: "minute", title: "Minute" },
  { name: "hour", title: "Hour" },
  { name: "day", title: "Day" },
  { name: "week", title: "Week" },
  { name: "month", title: "Month" },
  { name: "quarter", title: "Quarter" },
  { name: "year", title: "Year" },
];

const memberMap = (memberArray: CubeMember[]) =>
  fromPairs(memberArray.map((m) => [m.name, m]));

class Meta {
  cubesMap: Record<string, CubeMember>;

  constructor(cubesMap?: Record<string, CubeMember>) {
    this.cubesMap = cubesMap || {};
  }

  getCubeMembers(
    memberName: string,
    memberType: string
  ): Record<string, CubeMember> {
    const [cube] = memberName.split(".");

    if (!this.cubesMap[cube]) {
      return {};
    }

    return this.cubesMap[cube][memberType as keyof CubeMember];
  }

  resolveMember(memberName: string, memberType: string | string[]) {
    const [cube] = memberName.split(".");

    if (!this.cubesMap[cube]) {
      return {
        title: memberName,
        error: `Cube not found ${cube} for path '${memberName}'`,
      };
    }

    const memberTypes = Array.isArray(memberType) ? memberType : [memberType];

    const member = memberTypes
      .map(
        (type) =>
          this.getCubeMembers(cube, type) &&
          this.getCubeMembers(cube, type)[memberName]
      )
      .find((m) => m);

    if (!member) {
      return { title: memberName, error: `Path not found '${memberName}'` };
    }

    return member;
  }

  filterOperatorsForMember(memberName: string, memberType: string | string[]) {
    const member = this.resolveMember(memberName, memberType);
    if (!("type" in member)) return operators.string;
    const key = member.type as keyof typeof operators;
    return operators[key] ?? operators.string;
  }
}

const enrichPlaygroundMembers = (cubesMetaCls: Meta, playgroundState: any) => {
  const resolveWithIndex = (key: string) =>
    getOr([], key, playgroundState).map((value: string, index: number) => ({
      index,
      ...cubesMetaCls.resolveMember(value, key),
    }));

  const timeDimensions = getOr([], "timeDimensions", playgroundState).map(
    (m: any, index: number) => ({
      ...m,
      ...cubesMetaCls.resolveMember(m.dimension, "dimensions"),
      name: m.granularity ? `${m.dimension}+${m.granularity}` : m.dimension,
      index,
    })
  );

  const filters = getOr([], "filters", playgroundState).map(
    (m: any, index: number) => ({
      ...m,
      dimension: cubesMetaCls.resolveMember(m.dimension, [
        "dimensions",
        "measures",
      ]),
      operators: cubesMetaCls.filterOperatorsForMember(m.dimension, [
        "dimensions",
        "measures",
      ]),
      index,
    })
  );

  const enrichedMembers = {
    measures: resolveWithIndex("measures"),
    dimensions: resolveWithIndex("dimensions")
      .filter(
        (m: CubeMember) =>
          m.type !== "time" || (m.type === "time" && !m.granularity)
      )
      .concat(timeDimensions),
    segments: resolveWithIndex("segments"),
    timeDimensions,
    filters,
  };

  return enrichedMembers;
};

const updatePlaygroundState = (playgroundState: any, cubesMeta: Meta) => {
  const keys = ["dimensions", "measures", "segments", "filters"];

  const updatedPlaygroundState = Object.keys(playgroundState).reduce(
    (acc, curKey) => {
      if (keys.find((key) => key === curKey)) {
        const filteredArray = playgroundState[curKey].filter((m: any) => {
          let resolved: any = false;
          if (curKey === "filters") {
            resolved = cubesMeta.resolveMember(m.dimension, [
              "dimensions",
              "measures",
            ]);
          } else {
            resolved = cubesMeta.resolveMember(m, curKey);
          }

          if (!resolved.error) {
            return true;
          }
        });

        return {
          ...acc,
          [curKey]: filteredArray,
        };
      }

      return {
        ...acc,
        [curKey]: playgroundState[curKey],
      };
    },
    {}
  );

  return updatedPlaygroundState;
};

interface Props {
  meta: Record<string, any>[];
  playgroundState: PlaygroundState;
}

interface Result {
  selectedQueryMembers?: Record<string, CubeMember[]>;
  availableQueryMembers?: Record<
    string,
    Record<string, Record<string, CubeMember>>
  >;
}

export default ({ meta = [], playgroundState }: Props): Result => {
  const result = useMemo(() => {
    if (!meta) {
      return {};
    }
    const cubesPairs: [string, CubeMembers][] = (meta || []).map((c) => [
      c.name,
      {
        measures: memberMap(c.measures),
        dimensions: memberMap(c.dimensions),
        segments: memberMap(c.segments),
        timeDimensions: memberMap(
          c.dimensions.filter((d: CubeMember) => d.type === "time")
        ),
      },
    ]);
    const cubesMap = fromPairs(cubesPairs);

    const cubesMeta = new Meta(cubesMap);
    const updatedPlaygroundState = updatePlaygroundState(
      playgroundState,
      cubesMeta
    );

    return {
      selectedQueryMembers: enrichPlaygroundMembers(
        cubesMeta,
        updatedPlaygroundState
      ),
      availableQueryMembers: cubesMap,
    };
  }, [meta, playgroundState]);

  return result;
};
