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
    setCurrentTeam(id);
    setTeamsOpen(false);
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
