import { useCallback } from "react";

import { useUpdateTeamSettingsMutation } from "@/graphql/generated";
import CurrentUserStore from "@/stores/CurrentUserStore";
import type { TeamSettings } from "@/types/team";

/**
 * Hook for reading and updating team settings (partition, internal_tables).
 *
 * Reads settings from the current team in the Zustand store.
 * Updates via the update_team_settings Hasura action.
 */
export default function useTeamSettings() {
  const { currentTeam } = CurrentUserStore();
  const [updateResult, execUpdate] = useUpdateTeamSettingsMutation();

  const settings: TeamSettings = (currentTeam?.settings as TeamSettings) ?? {};

  const updateSettings = useCallback(
    async (newSettings: TeamSettings) => {
      if (!currentTeam?.id) return;
      return execUpdate({
        team_id: currentTeam.id,
        settings: newSettings,
      });
    },
    [currentTeam?.id, execUpdate]
  );

  return {
    settings,
    teamId: currentTeam?.id ?? null,
    updating: updateResult.fetching,
    updateError: updateResult.error?.message ?? null,
    updateSettings,
  };
}
