import { useTranslation } from "react-i18next";
import { Dropdown, Button, Space, Tag } from "antd";
import cn from "classnames";

import Avatar from "@/components/Avatar";
import LanguageToggler from "@/components/LanguageToggler";
import CurrentUserStore from "@/stores/CurrentUserStore";
import type { Team } from "@/types/team";
import useLocation from "@/hooks/useLocation";

import TeamIcon from "@/assets/team.svg";
import DocsIcon from "@/assets/docs.svg";
import ArrowIcon from "@/assets/arrow-big-bold.svg";
import ArrowMiddleIcon from "@/assets/arrow-middle.svg";

import styles from "./index.module.less";

import type { FC } from "react";
import type { MenuProps } from "antd";

/**
 * Base paths whose sub-segments are team-scoped URL params (IDs).
 * Only includes routes with :param placeholders in the route definition.
 * Fixed paths like /settings/admin/* and /settings/info are NOT included.
 */
const TEAM_SCOPED_BASES = [
  "/settings/sources",
  "/settings/teams",
  "/settings/members",
  "/settings/sql-api",
  "/settings/roles",
  "/signals/alerts",
  "/signals/reports",
  "/logs/query",
  "/explore",
  "/models",
  "/export",
  "/docs",
  "/onboarding",
];

/**
 * Strip team-scoped URL params from a pathname, keeping the base section.
 * e.g. "/settings/sources/abc-123/generate" → "/settings/sources"
 *      "/explore/ds-id/exp-id" → "/explore"
 *      "/settings/info" → "/settings/info" (unchanged, no params)
 */
function stripTeamScopedParams(pathname: string): string {
  for (const base of TEAM_SCOPED_BASES) {
    if (pathname === base || pathname.startsWith(base + "/")) {
      return base;
    }
  }
  return pathname;
}

interface NavItem {
  label: string;
  href: string;
}

type MenuItem = Required<MenuProps>["items"][number];

interface NavbarProps {
  userMenu: NavItem[];
  username?: string | null;
  userAvatar?: string | null;
  direction?: "horizontal" | "vertical";
  teams?: Team[];
  wrap?: boolean;
  type?: "inline" | "dropdown";
}

const Navbar: FC<NavbarProps> = ({
  direction,
  teams = [],
  userMenu,
  username,
  userAvatar,
  wrap = false,
  type = "inline",
}) => {
  const [, setLocation] = useLocation();
  const { currentTeam, setCurrentTeam } = CurrentUserStore();
  const [teamsOpen, setTeamsOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const { t } = useTranslation(["common"]);

  const onSelectTeam = (id: string) => {
    const isSwitch = currentTeam?.id && currentTeam.id !== id;
    setCurrentTeam(id);
    setTeamsOpen(false);
    if (isSwitch) {
      // Stay on the same page section but strip team-scoped URL params
      // (datasource IDs, model IDs, exploration IDs, etc.)
      const basePath = stripTeamScopedParams(window.location.pathname);
      if (basePath !== window.location.pathname) {
        setLocation(basePath);
      }
    }
  };

  const onClick = (href: string) => {
    setLocation(href);
  };

  const docs = (
    <Button
      className={styles.docs}
      href="https://docs.fraios.com"
      target="_blank"
    >
      <Space size={10} align="start">
        <span className={styles.docsIcon}>
          <DocsIcon />
        </span>
        {t("common:words.docs")}
      </Space>
    </Button>
  );

  const teamsMenu: MenuItem[] = teams.map((tm) => ({
    key: tm.id,
    label: (
      <Space>
        {tm.name}
        {currentTeam?.id === tm.id && (
          <Tag style={{ margin: 0 }}>{t("common:words.current")}</Tag>
        )}
      </Space>
    ),
    onClick: () => onSelectTeam(tm.id),
  }));

  teamsMenu.push({
    key: "/settings/teams",
    label: t("common:words.edit_teams"),
    onClick: () => onClick("/settings/teams"),
  });

  const userMenuItems: MenuItem[] = userMenu.map((u) => ({
    label: u.label,
    key: u.href,
    onClick: () => onClick(u.href),
    type: "item",
  }));

  const account = (
    <Dropdown
      trigger={["click"]}
      onOpenChange={setAccountOpen}
      menu={{
        items: userMenuItems,
      }}
    >
      <Space className={styles.dropdownHeader} align="center">
        <Avatar username={username} img={userAvatar} />
        <span className={cn(styles.icon, { [styles.rotate]: accountOpen })}>
          <ArrowIcon />
        </span>
      </Space>
    </Dropdown>
  );

  if (type === "dropdown") {
    if (!!teams?.length) {
      const teamMobileMenu: MenuItem = {
        label: t("common:words.teams"),
        key: "/settings/teams",
        children: teamsMenu,
        type: "group",
      };

      userMenuItems.unshift({ type: "divider" });
      userMenuItems.unshift(teamMobileMenu);
      userMenuItems.unshift({ type: "divider" });

      userMenuItems.unshift({
        label: t("common:words.docs"),
        key: "/docs",
        onClick: () => onClick("/docs"),
      });
    } else {
      userMenuItems.unshift({
        label: t("common:words.docs"),
        key: "/docs",
        onClick: () => onClick("/docs"),
      });
    }

    return account;
  }

  return (
    <Space size={20} direction={direction} align="center" wrap={wrap}>
      {docs}
      {!!teams?.length && (
        <Dropdown
          trigger={["click"]}
          onOpenChange={setTeamsOpen}
          menu={{
            items: teamsMenu,
          }}
        >
          <Button>
            <div className={styles.teamContainer}>
              <TeamIcon />
              <span className={styles.team}>
                {currentTeam ? currentTeam.name : t("common:words.team")}
              </span>
              <ArrowMiddleIcon
                className={cn(styles.icon, { [styles.rotate]: teamsOpen })}
              />
            </div>
          </Button>
        </Dropdown>
      )}
      {type === "inline" && <LanguageToggler />}
      {account}
    </Space>
  );
};

export default Navbar;
