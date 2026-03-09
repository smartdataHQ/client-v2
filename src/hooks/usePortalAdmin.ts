import CurrentUserStore from "@/stores/CurrentUserStore";

const PORTAL_ADMIN_DOMAIN = "@snjallgogn.is";

export default function usePortalAdmin() {
  const { currentUser } = CurrentUserStore();
  const isPortalAdmin =
    currentUser?.email?.endsWith(PORTAL_ADMIN_DOMAIN) ?? false;

  return { isPortalAdmin };
}
