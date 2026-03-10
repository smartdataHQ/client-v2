import { useEffect, useMemo } from "react";

import type { Maybe } from "@/graphql/generated";
import {
  useCreateDataSourceMutation,
  useDeleteDataSourceMutation,
  useCheckConnectionMutation,
  useGenDataSchemasMutation,
  useRunSourceSqlQueryMutation,
  useUpdateDataSourceMutation,
  useFetchMetaQuery,
  useFetchTablesQuery,
  useSmartGenDataSchemasMutation,
  useUpdateTeamSettingsMutation,
} from "@/graphql/generated";

type Params = {
  editId?: string | null;
  teamId?: Maybe<string>;
  branchId?: Maybe<string>;
};

interface Props {
  params?: Params;
}

export default ({ params = {} }: Props) => {
  const { editId, branchId } = params;

  const [createMutation, execCreateMutation] = useCreateDataSourceMutation();
  const [updateMutation, execUpdateMutation] = useUpdateDataSourceMutation();
  const [deleteMutation, execDeleteMutation] = useDeleteDataSourceMutation();
  const [checkMutation, execCheckMutation] = useCheckConnectionMutation();
  const [genSchemaMutation, execGenSchemaMutation] =
    useGenDataSchemasMutation();
  const [runQueryMutation, execRunQueryMutation] =
    useRunSourceSqlQueryMutation();
  const [smartGenMutation, execSmartGenMutation] =
    useSmartGenDataSchemasMutation();
  const [updateTeamSettingsMutation, execUpdateTeamSettingsMutation] =
    useUpdateTeamSettingsMutation();

  const [metaData, execQueryMeta] = useFetchMetaQuery({
    pause: true,
    variables: {
      datasource_id: editId,
      branch_id: branchId,
    },
    requestPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (editId && branchId) {
      execQueryMeta();
    }
  }, [branchId, editId, execQueryMeta]);

  const currentMeta = useMemo(
    () => metaData.data?.fetch_meta?.cubes || [],
    [metaData.data]
  );

  const [tablesData, execQueryTables] = useFetchTablesQuery({
    variables: { id: editId },
    pause: true,
    requestPolicy: "cache-and-network",
  });

  return {
    currentMeta,
    queries: {
      tablesData,
      execQueryTables,
      metaData,
      execQueryMeta,
    },
    mutations: {
      createMutation,
      execCreateMutation,
      deleteMutation,
      execDeleteMutation,
      updateMutation,
      execUpdateMutation,
      checkMutation,
      execCheckMutation,

      runQueryMutation,
      execRunQueryMutation,
      genSchemaMutation,
      execGenSchemaMutation,
      smartGenMutation,
      execSmartGenMutation,
      updateTeamSettingsMutation,
      execUpdateTeamSettingsMutation,
    },
  };
};
