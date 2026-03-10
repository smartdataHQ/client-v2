import { useEffect, useCallback } from "react";
import { useParams } from "@vitjs/runtime";

import type {
  DataSource,
  DataSourceSetupForm,
  DynamicForm,
} from "@/types/dataSource";
import { Branch_Statuses_Enum } from "@/graphql/generated";
import DataSourceSelection from "@/components/DataSourceSelection";
import DataSourceSetup from "@/components/DataSourceSetup";
import DataModelGeneration from "@/components/DataModelGeneration";
import ApiSetup from "@/components/ApiSetup";
import { dataSourceForms, dbTiles } from "@/mocks/dataSources";
import DataSourceStore from "@/stores/DataSourceStore";
import type { FormState } from "@/stores/DataSourceStore";
import CurrentUserStore from "@/stores/CurrentUserStore";
import useLocation from "@/hooks/useLocation";
import { MODELS } from "@/utils/constants/paths";

import type { FC } from "react";

interface CopyFromOption {
  id: string;
  name: string;
  teamName: string;
  dbType: string;
}

interface DataSourceFormBodyProps {
  activeStep?: number;
  formState?: FormState;
  loading?: boolean;
  onSkip?: () => void;
  onChangeStep?: (value: number) => void;
  onFinish: () => void;
  onTestConnection?: (data: DataSourceSetupForm) => void;
  onDataSourceSetupSubmit?: (data: DataSourceSetupForm) => void;
  onDataModelGenerationSubmit?: (data: DynamicForm) => void;
  onDataSourceSelect?: (value: DataSource) => void;
  copyFromOptions?: CopyFromOption[];
  onCopyFrom?: (datasourceId: string) => void;
}

const DataSourceFormBody: FC<DataSourceFormBodyProps> = ({
  activeStep,
  formState,
  loading = false,
  onSkip,
  onChangeStep,
  onFinish = () => {},
  onTestConnection = () => {},
  onDataSourceSetupSubmit = () => {},
  onDataModelGenerationSubmit = () => {},
  onDataSourceSelect = () => {},
  copyFromOptions = [],
  onCopyFrom,
}) => {
  const {
    step,
    isOnboarding,
    isGenerate,
    formState: formData,
    schema,
    setStep,
  } = DataSourceStore();

  const { editId } = useParams();
  const { teamData } = CurrentUserStore();
  const [, setLocation] = useLocation();

  const SMART_GEN_TABLES = ["semantic_events", "data_points", "entities"];

  const onSmartGenerate = useCallback(
    (_schemaName: string, _tableName: string) => {
      if (!editId || !teamData?.dataSources) return;
      const ds = teamData.dataSources.find((d) => d.id === editId);
      const activeBranch = ds?.branches?.find(
        (b) => b.status === Branch_Statuses_Enum.Active
      );
      if (!activeBranch) return;
      setLocation(`${MODELS}/${editId}/${activeBranch.id}/smartgen`);
    },
    [editId, teamData, setLocation]
  );

  const onGoBack = () => onChangeStep?.(step - 1) || setStep(step - 1);
  const onGoForward = () => onChangeStep?.(step + 1) || setStep(step + 1);

  const onDataSourceSetup = async (data: DataSourceSetupForm) => {
    await onDataSourceSetupSubmit(data);
  };

  const onDataModelGeneration = async (data: DynamicForm) => {
    await onDataModelGenerationSubmit(data);
  };

  useEffect(() => {
    if (activeStep) {
      setStep(activeStep);
    }
  }, [activeStep, setStep]);

  const curDataSource = formState?.step0 || formData?.step0;

  switch (step) {
    case 0:
      return (
        <DataSourceSelection
          onSkip={onSkip}
          onSubmit={onDataSourceSelect}
          initialValue={curDataSource}
          options={dbTiles}
          copyFromOptions={copyFromOptions}
          onCopyFrom={onCopyFrom}
        />
      );
    case 1:
      if (curDataSource) {
        const initialValue = formState?.step1 || formData?.step1;
        return (
          <DataSourceSetup
            dataSource={curDataSource}
            fields={
              dataSourceForms[
                Object.keys(dataSourceForms).find(
                  (f) => f === curDataSource?.value
                ) ?? "default"
              ]
            }
            loading={loading}
            isOnboarding={isOnboarding}
            initialValue={initialValue}
            onSubmit={onDataSourceSetup}
            onSkip={onSkip}
            onGoBack={onGoBack}
            onTestConnection={onTestConnection}
          />
        );
      }
    case 2:
      return (
        <DataModelGeneration
          dataSource={{
            icon: curDataSource?.icon,
            name: curDataSource?.name,
          }}
          isGenerate={isGenerate}
          isOnboarding={isOnboarding}
          schema={schema}
          onSubmit={onDataModelGeneration}
          onGoBack={onGoBack}
          onSkip={onSkip || onGoForward}
          loading={loading}
          initialValue={formState?.step2 || formData?.step2 || {}}
          smartGenTables={SMART_GEN_TABLES}
          onSmartGenerate={onSmartGenerate}
        />
      );
    case 3:
      const initialValue = formState?.step3 || formData?.step3;
      return (
        <ApiSetup
          isOnboarding={isOnboarding}
          initialValue={initialValue}
          onSubmit={onFinish}
          onGoBack={onGoBack}
        />
      );
  }

  return (
    <DataSourceSelection
      onSubmit={onDataSourceSelect}
      initialValue={curDataSource}
      options={dbTiles}
      onSkip={onSkip}
      copyFromOptions={copyFromOptions}
      onCopyFrom={onCopyFrom}
    />
  );
};

export default DataSourceFormBody;
