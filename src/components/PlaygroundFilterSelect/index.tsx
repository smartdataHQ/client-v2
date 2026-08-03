import { Select, Tooltip } from "antd";
import { useDebounceFn } from "ahooks";
import { useTranslation } from "react-i18next";

import type { CubeMember } from "@/types/cube";

import ArrowBottom from "@/assets/arrow-big.svg";

import s from "./index.module.less";

import type { FC } from "react";

interface PlaygroundFilterSelectProps {
  availableMembers: CubeMember[];
  onChange: (member?: CubeMember) => void;
  value?: string;
}

const getMemberLabel = (member: CubeMember) =>
  member.shortTitle || member.title || member.name;

const getCubeName = (member: CubeMember) => {
  const parts = (member.name || "").split(".");
  return parts.length > 1 ? parts[0] : undefined;
};

const PlaygroundFilterSelect: FC<PlaygroundFilterSelectProps> = ({
  availableMembers,
  value,
  onChange,
}) => {
  const { t } = useTranslation(["explore"]);

  const [data, setData] = useState(availableMembers);

  useEffect(() => {
    setData(availableMembers);
  }, [availableMembers]);

  const { run: handleSearch } = useDebounceFn(
    (val: string) => {
      const query = val.trim().toLowerCase();
      if (!query) {
        setData(availableMembers);
        return;
      }

      setData(
        availableMembers.filter((m) =>
          [m.shortTitle, m.title, m.name]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(query))
        )
      );
    },
    { wait: 200 }
  );

  const selectedMember =
    availableMembers.find((m) => m.name === value) ||
    data.find((m) => m.name === value);

  return (
    <Tooltip title={selectedMember?.title || selectedMember?.name || value}>
      <Select
        className={s.select}
        showSearch
        value={value || undefined}
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        optionLabelProp="label"
        onChange={(val) =>
          onChange(availableMembers.find((d) => d.name === val))
        }
        placeholder={t("filters.filter_name")}
        size="large"
        suffixIcon={<ArrowBottom />}
      >
        {data.map((d) => {
          const label = getMemberLabel(d);
          const cubeName = getCubeName(d);

          return (
            <Select.Option
              key={d.name}
              value={d.name}
              label={label}
              title={d.title || d.name}
            >
              <span className={s.optionLabel}>{label}</span>
              {cubeName && <span className={s.optionCube}>{cubeName}</span>}
            </Select.Option>
          );
        })}
      </Select>
    </Tooltip>
  );
};

export default PlaygroundFilterSelect;
