import cn from "classnames";
import { Row, Col, Typography, Tag, Tooltip } from "antd";

import CategoryItemFilter from "@/components/ExploreCubesCategoryItemFilter";
import {
  isLookupKeyDimension,
  isResolvedDimension,
} from "@/utils/helpers/filterParamsResolver";
import type { CubeMember } from "@/types/cube";

import MemberString from "@/assets/member-string.svg";
import MemberNumber from "@/assets/member-number.svg";
import MemberSegment from "@/assets/member-segment.svg";
import MemberBoolean from "@/assets/member-boolean.svg";
import MemberCurrency from "@/assets/member-currency.svg";
import MemberGeo from "@/assets/member-geo.svg";
import MemberId from "@/assets/member-id.svg";
import MemberImg from "@/assets/member-img.svg";
import MemberLink from "@/assets/member-link.svg";
import MemberPercent from "@/assets/member-percent.svg";
import MemberTime from "@/assets/member-time.svg";

import s from "./index.module.less";

import type { FC } from "react";

const { Paragraph } = Typography;

const memberTypeIcons: Record<string, JSX.Element> = {
  string: <MemberString />,
  number: <MemberNumber />,
  default: <MemberSegment />,
  boolean: <MemberBoolean />,
  time: <MemberTime />,
  geo: <MemberGeo />,
};

const memberFormatIcons: Record<string, JSX.Element> = {
  id: <MemberId />,
  link: <MemberLink />,
  imageUrl: <MemberImg />,
  percent: <MemberPercent />,
  currency: <MemberCurrency />,
};

const CategoryItem: FC<CategoryItemProps> = ({
  onAction,
  member,
  category,
  selectedIndex,
  onFilterUpdate,
  selectedFilterIndex,
  hoverState,
}) => {
  const isFilterVisible = member.type !== "time" && category !== "segments";
  const icon =
    memberFormatIcons?.[member?.format || ""] ||
    memberTypeIcons?.[member?.type] ||
    memberTypeIcons.default;
  const isLookup = isLookupKeyDimension(member);
  const isResolved = isResolvedDimension(member);

  return (
    <div
      key={member.name}
      onBlur={() => {}}
      onFocus={() => {}}
      onClick={() => onAction("click", member)}
      onMouseOver={() => onAction("over", member)}
      onMouseOut={() => onAction("out", member)}
      onPointerDown={() => onAction("focus", member)}
      onPointerUp={() => onAction("out", member)}
      onMouseDown={() => onAction("focus", member)}
      onMouseUp={() => onAction("out", member)}
      className={cn({
        [s.pointer]: true,
        [s.memberActive]: selectedIndex > -1,
        [s.memberHovered]: hoverState === "over",
        [s.memberFocused]: hoverState === "focus",
      })}
    >
      <Paragraph className={s.memberSection}>
        <Row justify="space-between" align="middle">
          <Col xs={16}>
            <div className={s.memberRow}>
              <div className={s.memberIcon}>{icon}</div>
              <a className={cn(s.member)}>{member.shortTitle}</a>
              {isLookup && (
                <Tooltip
                  title={`Selector — values: ${(
                    member.meta?.known_values || []
                  ).join(", ")}`}
                >
                  <Tag color="purple" className={s.paramTag}>
                    S
                  </Tag>
                </Tooltip>
              )}
              {isResolved && (
                <Tooltip
                  title={`Requires selector: ${member.meta?.resolved_by}`}
                >
                  <Tag color="purple" className={s.paramTag}>
                    S
                  </Tag>
                </Tooltip>
              )}
            </div>
          </Col>
          <CategoryItemFilter
            isVisible={isFilterVisible}
            onFilterUpdate={onFilterUpdate}
            selectedFilterIndex={selectedFilterIndex}
            member={member}
          />
        </Row>
      </Paragraph>
    </div>
  );
};

interface CategoryItemProps {
  member: CubeMember;
  category: string;
  selectedIndex: number;
  selectedFilterIndex: number;
  onFilterUpdate: {
    add: (member: CubeMember) => void;
    remove: (member: CubeMember) => void;
  };
  onAction: (actions: string, member: CubeMember) => void;
  hoverState: "over" | "focus" | false;
}

const CategoryItemMemo = memo<CategoryItemProps>(
  CategoryItem,
  (prevProps, nextProps) => {
    // memo only by these props
    if (
      prevProps.selectedIndex === nextProps.selectedIndex &&
      prevProps.selectedFilterIndex === nextProps.selectedFilterIndex &&
      prevProps.member.name === nextProps.member.name &&
      prevProps.hoverState === nextProps.hoverState
    ) {
      return true;
    }

    return false;
  }
);

export default CategoryItemMemo;
