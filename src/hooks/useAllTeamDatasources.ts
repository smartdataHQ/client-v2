import { useMemo } from "react";

import { useTeamDataQuery } from "@/graphql/generated";
import CurrentUserStore from "@/stores/CurrentUserStore";

interface TeamDatasource {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  dbType: string;
}

/**
 * Fetches datasources from all teams the user belongs to.
 * Returns datasources from teams OTHER than the current team.
 */
const useAllTeamDatasources = (): {
  datasources: TeamDatasource[];
  loading: boolean;
} => {
  const { currentUser, currentTeam } = CurrentUserStore();
  const otherTeams = currentUser.teams.filter((t) => t.id !== currentTeam?.id);

  // Query up to 5 other teams (should be plenty)
  const [team0] = useTeamDataQuery({
    variables: { team_id: otherTeams[0]?.id || "" },
    pause: !otherTeams[0]?.id,
  });
  const [team1] = useTeamDataQuery({
    variables: { team_id: otherTeams[1]?.id || "" },
    pause: !otherTeams[1]?.id,
  });
  const [team2] = useTeamDataQuery({
    variables: { team_id: otherTeams[2]?.id || "" },
    pause: !otherTeams[2]?.id,
  });
  const [team3] = useTeamDataQuery({
    variables: { team_id: otherTeams[3]?.id || "" },
    pause: !otherTeams[3]?.id,
  });
  const [team4] = useTeamDataQuery({
    variables: { team_id: otherTeams[4]?.id || "" },
    pause: !otherTeams[4]?.id,
  });

  const results = [team0, team1, team2, team3, team4];
  const loading = results.some((r, i) => otherTeams[i]?.id && r.fetching);

  const datasources = useMemo(() => {
    const all: TeamDatasource[] = [];
    results.forEach((result, i) => {
      const team = otherTeams[i];
      if (!team || !result.data?.teams_by_pk?.datasources) return;
      result.data.teams_by_pk.datasources.forEach((ds: any) => {
        all.push({
          id: ds.id,
          name: ds.name,
          teamId: team.id,
          teamName: team.name,
          dbType: ds.db_type,
        });
      });
    });
    return all;
  }, [
    results[0].data,
    results[1].data,
    results[2].data,
    results[3].data,
    results[4].data,
    otherTeams,
  ]);

  return { datasources, loading };
};

export default useAllTeamDatasources;
