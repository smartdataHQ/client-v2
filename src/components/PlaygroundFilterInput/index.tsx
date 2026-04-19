import { Select, Input, DatePicker } from "antd";
import dayjs, { extend } from "dayjs";
import { useDebounceFn } from "ahooks";
import ru from "antd/es/date-picker/locale/ru_RU";
import en from "antd/es/date-picker/locale/en_US";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

import I18n from "i18next.config";
import type { CubeMember } from "@/types/cube";
import trackEvent from "@/utils/helpers/trackEvent";

import type { FC } from "react";

extend(customParseFormat);
extend(advancedFormat);
extend(weekday);
extend(localeData);
extend(weekOfYear);
extend(weekYear);

const locales = {
  en,
  ru,
};
const rangeOperators = ["inDateRange", "notInDateRange"];
const inputlessOperators = ["set", "notSet"];

const { RangePicker } = DatePicker;

interface PlaygroundFilterInputProps {
  values: string[];
  onChange: (newValues: string[]) => void;
}

const filterInputs = {
  string: ({ values, onChange }: PlaygroundFilterInputProps) => (
    <Select
      size="large"
      key="input"
      style={{ width: 300 }}
      mode="tags"
      onChange={onChange}
      value={values}
    />
  ),
  number: ({ values, onChange }: PlaygroundFilterInputProps) => (
    <Input
      size="large"
      key="input"
      type="number"
      style={{ width: 300 }}
      onChange={(e) => onChange([e.target.value])}
      value={(values && values[0]) || ""}
    />
  ),
  boolean: ({ values, onChange }: PlaygroundFilterInputProps) => (
    <Select
      size="large"
      key="input"
      style={{ width: 300 }}
      value={values?.[0] ?? "true"}
      onChange={(value) => onChange([value])}
      options={[
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ]}
    />
  ),
  time: ({ values, onChange }: PlaygroundFilterInputProps) => (
    <DatePicker
      size="large"
      value={Date.parse(values[0]) ? dayjs(values[0]) : undefined}
      onChange={(_, dateString) => onChange([dateString])}
    />
  ),
  timeRange: ({ values, onChange }: PlaygroundFilterInputProps) => {
    return (
      <RangePicker
        size="large"
        key="input"
        value={
          values
            ? [
                Date.parse(values[0]) ? dayjs(values[0]) : null,
                Date.parse(values[1]) ? dayjs(values[1]) : null,
              ]
            : null
        }
        onChange={(_, dateStrings) => onChange(dateStrings)}
        locale={locales?.[I18n.language as keyof typeof locales] || locales.en}
      />
    );
  },
};

interface FilterInputProps {
  member: CubeMember;
  updateMethods: {
    update: (member: CubeMember, newValue: any) => void;
    remove: (member: CubeMember) => void;
  };
  addMemberName: string;
}

const FilterInput: FC<FilterInputProps> = ({
  member,
  updateMethods,
  addMemberName,
}) => {
  const [memberValues, setMemberValues] = useState(member.values || []);

  const { run: debouncedUpdate } = useDebounceFn(
    ({ values }) => {
      trackEvent("Update Filter Values", { memberName: addMemberName });

      updateMethods.update(member, { ...member, values });
    },
    { wait: 500 }
  );

  if (
    !member ||
    (member.operator && inputlessOperators.includes(member.operator))
  ) {
    return null;
  }

  const dimensionType = member?.dimension?.type || "";
  let Filter =
    filterInputs[dimensionType as keyof typeof filterInputs] ||
    filterInputs.string;

  if (member.operator && rangeOperators.includes(member.operator)) {
    Filter = filterInputs.timeRange;
  }

  return (
    <Filter
      key="filter"
      values={memberValues}
      onChange={(values) => {
        setMemberValues(values);
        debouncedUpdate({ values });
      }}
    />
  );
};

export default FilterInput;
