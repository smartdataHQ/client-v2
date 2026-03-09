import { useTranslation } from "react-i18next";

import SidebarMenu from "@/components/SidebarMenu";
import type { Location } from "@/hooks/useLocation";
import SidebarLayout from "@/layouts/SidebarLayout";
import type { SidebarMenuItem } from "@/mocks/sidebarMenu";
import usePortalAdmin from "@/hooks/usePortalAdmin";
import CurrentUserStore from "@/stores/CurrentUserStore";
import { Roles } from "@/types/team";

import AlertsIcon from "@/assets/alert-logs.svg";
import DataSourceIcon from "@/assets/data-source.svg";
import MembersIcon from "@/assets/members.svg";
import PersonalInfoIcon from "@/assets/personal-info.svg";
import ReportsIcon from "@/assets/report-logs.svg";
import RolesAndAccessIcon from "@/assets/roles-and-access.svg";
import Icon from "@/assets/settings-active.svg";
import SQLAPIIcon from "@/assets/sql-api.svg";
import TeamsIcon from "@/assets/team.svg";

import type { ReactNode } from "react";

export type SidebarLayoutProps = {
  title?: string;
  children: ReactNode;
  location: Location;
};

const SettingsLayout: React.FC<SidebarLayoutProps> = ({
  title,
  children,
  location,
}) => {
  const { t } = useTranslation(["pages"]);
  const splitedPath = (location?.pathname || "").split("/");
  const { currentTeam } = CurrentUserStore();
  const { isPortalAdmin } = usePortalAdmin();
  const isMember = currentTeam?.role === Roles.member;
  const titleKey = splitedPath?.[2];
  const subKey = splitedPath?.[1];

  const settingsMenuItems: SidebarMenuItem[] = [
    {
      key: "data-sources",
      label: t("common:words.data_sources"),
      href: "/settings/sources",
      icon: <DataSourceIcon />,
    },
    {
      key: "sql-api",
      label: t("common:words.sql_api"),
      href: "/settings/sql-api",
      icon: <SQLAPIIcon />,
    },
    {
      key: "members",
      label: t("common:words.members"),
      href: "/settings/members",
      icon: <MembersIcon />,
    },
    (!isMember && {
      key: "roles",
      label: t("common:words.roles_and_access"),
      href: "/settings/roles",
      icon: <RolesAndAccessIcon />,
    }) ||
      null,
    {
      key: "teams",
      label: t("common:words.teams"),
      href: "/settings/teams",
      icon: <TeamsIcon />,
    },
    {
      key: "personal-info",
      label: t("common:words.personal_info"),
      href: "/settings/info",
      icon: <PersonalInfoIcon />,
    },
    (isPortalAdmin && {
      key: "admin-team-properties",
      label: "Team Properties",
      href: "/settings/admin/team-properties",
      icon: <TeamsIcon />,
    }) ||
      null,
    (isPortalAdmin && {
      key: "admin-member-properties",
      label: "Member Properties",
      href: "/settings/admin/member-properties",
      icon: <MembersIcon />,
    }) ||
      null,
    (isPortalAdmin && {
      key: "admin-query-rules",
      label: "Query Rules",
      href: "/settings/admin/query-rules",
      icon: <RolesAndAccessIcon />,
    }) ||
      null,
  ].filter((item) => !!item?.key);

  const singalsMenuItems: SidebarMenuItem[] = [
    {
      key: "alerts",
      icon: <AlertsIcon />,
      href: "/signals/alerts",
      label: t("common:words.alerts"),
    },
    {
      key: "reports",
      icon: <ReportsIcon />,
      href: "/signals/reports",
      label: t("common:words.reports"),
    },
  ];

  const sidebar = {
    settings: settingsMenuItems,
    signals: singalsMenuItems,
  };

  return (
    <SidebarLayout
      icon={<Icon />}
      title={title || t(`pages:${titleKey}`)}
      items={<SidebarMenu items={sidebar[subKey as keyof typeof sidebar]} />}
      burgerTitle={subKey}
      subTitle={t(`pages:${subKey}`, subKey)}
    >
      {children}
    </SidebarLayout>
  );
};

export default SettingsLayout;
