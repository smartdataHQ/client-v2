import { message } from "antd";
import { useTranslation } from "react-i18next";
import { dequal } from "dequal";

import type {
  Datasources_Pk_Columns_Input,
  Datasources_Set_Input,
} from "@/graphql/generated";
import {
  Branch_Statuses_Enum,
  useCheckConnectionMutation,
  useCreateDataSourceMutation,
  useFetchTablesQuery,
  useGenDataSchemasMutation,
  useInsertSqlCredentialsMutation,
  useUpdateDataSourceMutation,
} from "@/graphql/generated";
import { prepareInitValues } from "@/pages/SqlApi";
import CurrentUserStore from "@/stores/CurrentUserStore";
import DataSourceStore, { defaultFormState } from "@/stores/DataSourceStore";
import type { DataSourceState } from "@/stores/DataSourceStore";
import type {
  ApiSetupForm,
  DataSourceInfo,
  DataSourceSetupForm,
  DynamicForm,
} from "@/types/dataSource";
import useCheckResponse from "@/hooks/useCheckResponse";
import { getSourceAndBranch } from "@/pages/Explore";
import getTables from "@/utils/helpers/getTables";

interface Props {
  editId?: string;
}

interface CredentialParams {
  user_id: string;
  username: string;
  password: string;
  datasource_id?: string;
}

export default ({ editId }: Props) => {
  const { t } = useTranslation(["dataSourceStepForm"]);
  const { currentTeam, teamData, currentUser } = CurrentUserStore();

  const [, execInsertSqlCredentialsMutation] =
    useInsertSqlCredentialsMutation();
  const [checkConnectionMutation, execCheckConnection] =
    useCheckConnectionMutation();
  const [createMutation, execCreateMutation] = useCreateDataSourceMutation();
  const [updateMutation, execUpdateMutation] = useUpdateDataSourceMutation();
  const [genSchemaMutation, execGenSchemaMutation] =
    useGenDataSchemasMutation();

  const {
    formState: { step0: dataSource, step1: dataSourceSetup },
    branchId,
    schema,
    step,
    clean,
    setSchema,
    setFormStateData,
  } = DataSourceStore();

  const [fetchTablesQuery, execFetchTables] = useFetchTablesQuery({
    variables: { id: dataSourceSetup?.id },
    pause: true,
  });

  useCheckResponse(createMutation, () => {}, {
    successMessage: t("datasource_created"),
  });

  useCheckResponse(updateMutation, () => {}, {
    successMessage: t("datasource_updated"),
  });

  useCheckResponse(fetchTablesQuery, () => {}, {
    showMessage: false,
  });

  useCheckResponse(genSchemaMutation, () => {}, {
    successMessage: t("schema_generated"),
  });

  useCheckResponse(checkConnectionMutation, () => {}, {
    successMessage: t("connection_ok"),
  });

  const dataSources = useMemo(
    () => teamData?.dataSources || [],
    [teamData]
  ) as DataSourceInfo[];
  const curDataSource = useMemo(
    () =>
      dataSources.find((d) => d.id === editId || d.id === dataSourceSetup?.id),
    [editId, dataSourceSetup?.id, dataSources]
  );

  const onDataModelGenerationSubmit = async (data: DynamicForm) => {
    let tables = { ...data } as any;
    delete tables.type;
    tables = getTables(tables);

    if (dataSourceSetup && !branchId) {
      message.error(`${t("no_branch")} ${dataSourceSetup.name}`);
      return;
    }

    if (dataSourceSetup) {
      const res = await execGenSchemaMutation({
        datasource_id: dataSourceSetup.id,
        branch_id: branchId,
        tables,
        format: data?.type || "yaml",
        overwrite: true,
      });

      if (res.error) {
        return null;
      }

      return true;
    }
  };

  const prepareSqlApiData = (
    dataSourceName?: string,
    dataSourceId?: string
  ): { apiConfig: ApiSetupForm; credentialParams: CredentialParams } => {
    const apiConfig: ApiSetupForm = prepareInitValues(
      dataSourceId,
      currentUser.id,
      dataSourceName
    );
    const credentialParams: CredentialParams = {
      user_id: currentUser.id,
      username: apiConfig.db_username,
      password: apiConfig.password,
    };

    if (dataSourceId) {
      credentialParams.datasource_id = dataSourceId;
    }

    return { apiConfig, credentialParams };
  };

  const tryInsertSqlCredentials = async (
    dataSourceId?: string,
    dataSourceName?: string,
    attemptsLeft: number = 5
  ): Promise<ApiSetupForm | any> => {
    if (attemptsLeft === 0) {
      return false;
    }

    const { apiConfig, credentialParams } = prepareSqlApiData(
      dataSourceName,
      dataSourceId
    );
    const res = await execInsertSqlCredentialsMutation({
      object: credentialParams,
    });

    const newCredentials = res.data?.insert_sql_credentials_one;
    if (res.error || !newCredentials) {
      return await tryInsertSqlCredentials(
        dataSourceId,
        dataSourceName,
        attemptsLeft - 1
      );
    }

    return apiConfig;
  };

  const createOrUpdateDataSource = async (data: DataSourceSetupForm) => {
    let dataSourceId;
    let newBranchId;

    if (!dataSourceSetup?.id) {
      const newData = {
        ...data,
        db_type: dataSource?.value?.toUpperCase(),
      } as Datasources_Set_Input;

      if (currentTeam?.id) {
        newData.team_id = currentTeam?.id;
      }

      // eslint-disable-next-line prefer-const
      let { apiConfig, credentialParams } = prepareSqlApiData(data.name);
      const result = await execCreateMutation({
        object: {
          ...newData,
          branches: {
            data: [
              {
                status: Branch_Statuses_Enum.Active,
                user_id: currentUser.id,
              },
            ],
          },
          sql_credentials: {
            data: [credentialParams],
          },
        },
      });

      const newDataSource = result?.data?.insert_datasources_one;
      dataSourceId = newDataSource?.id;
      newBranchId = newDataSource?.branches[0]?.id;

      const newCredentials =
        !!result?.data?.insert_datasources_one?.sql_credentials?.[0];
      if (!newCredentials) {
        apiConfig = await tryInsertSqlCredentials(dataSourceId, data.name);

        if (!apiConfig) {
          message.error(`${t("sql_credentials_error")} ${data.name}`);
          return;
        }
      }

      setFormStateData(3, {
        ...apiConfig,
        datasource_id: dataSourceId,
      });
    } else {
      delete data.id;
      const newData = {
        pk_columns: { id: dataSourceSetup?.id } as Datasources_Pk_Columns_Input,
        _set: data as Datasources_Set_Input,
      };

      const result = await execUpdateMutation(newData);

      dataSourceId = result?.data?.update_datasources_by_pk?.id;
      newBranchId = result?.data?.update_datasources_by_pk?.branches?.[0]?.id;
    }

    if (dataSourceId) {
      setFormStateData(
        1,
        {
          ...data,
          id: dataSourceId,
        },
        {
          branchId: newBranchId,
        }
      );
      return dataSourceId;
    }
  };

  const onTestConnection = async (data: DataSourceSetupForm) => {
    const test = await execCheckConnection({
      id: dataSourceSetup?.id || data?.id,
    });

    if (!test.data?.check_connection) {
      return null;
    }
    return true;
  };

  const onDataSourceSetupSubmit = async (
    data: DataSourceSetupForm,
    isTest?: boolean,
    callback?: () => void
  ) => {
    let dataSourceId = dataSourceSetup?.id;
    if (!dataSourceSetup?.id || !dequal({ ...data }, { ...dataSourceSetup })) {
      dataSourceId = await createOrUpdateDataSource(data);
    }

    const testResult = await onTestConnection({
      id: dataSourceId,
    } as DataSourceSetupForm);

    if (!testResult || isTest) {
      return;
    }

    callback?.();
  };

  useEffect(() => {
    if (curDataSource) {
      const { currentBranch } = getSourceAndBranch(
        dataSources,
        editId || dataSourceSetup?.id
      );
      DataSourceStore.setState(
        (prev) =>
          ({
            ...prev,
            formState: {
              ...defaultFormState,
              ...prev.formState,
              step0: curDataSource.type,
              step1: {
                id: curDataSource?.id,
                db_params: { ...curDataSource.dbParams },
                name: curDataSource.name,
                ...prev.formState.step1,
              },
            },
            branchId: currentBranch?.id,
          } as Partial<DataSourceState>)
      );
    }
  }, [curDataSource, dataSourceSetup?.id, dataSources, editId]);

  useEffect(() => {
    if (step === 2 && dataSourceSetup?.id && !schema) {
      execFetchTables();
    }
  }, [dataSourceSetup?.id, schema, step, execFetchTables]);

  useEffect(() => {
    if (fetchTablesQuery.data) {
      setSchema(fetchTablesQuery.data?.fetch_tables?.schema);
    }
  }, [fetchTablesQuery.data, setSchema]);

  useEffect(() => {
    if (step === 0) {
      clean();
    }
  }, [clean, step]);

  const loading =
    createMutation.fetching ||
    checkConnectionMutation.fetching ||
    updateMutation.fetching ||
    genSchemaMutation.fetching ||
    fetchTablesQuery.fetching;

  return {
    loading,
    dataSources,
    curDataSource,
    onTestConnection,
    createOrUpdateDataSource,
    onDataModelGenerationSubmit,
    onDataSourceSetupSubmit,
  };
};
