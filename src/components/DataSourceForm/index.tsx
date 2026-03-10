import { Card, Spin } from "antd";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import StepFormHeader from "@/components/StepFormHeader";
import BouncingDotsLoader from "@/components/BouncingDotsLoader";
import DataSourceFormBody from "@/components/DataSourceFormBody";
import type {
  DataSource,
  DataSourceSetupForm,
  DynamicForm,
} from "@/types/dataSource";
import DataSourceStore from "@/stores/DataSourceStore";

import styles from "./index.module.less";

import type { FC } from "react";

interface CopyFromOption {
  id: string;
  name: string;
  teamName: string;
  dbType: string;
}

interface DataSourceFormProps {
  onFinish: () => void;
  onDataSourceSelect?: (data: DataSource) => void;
  onTestConnection?: (data: DataSourceSetupForm) => void;
  onDataSourceSetupSubmit?: (data: DataSourceSetupForm) => void;
  onDataModelGenerationSubmit?: (data: DynamicForm) => void;
  onChangeStep?: (value: number) => void;
  onSkip?: () => void;
  bordered?: boolean;
  loading?: boolean;
  shadow?: boolean;
  copyFromOptions?: CopyFromOption[];
  onCopyFrom?: (datasourceId: string) => void;
}

const DataSourceForm: FC<DataSourceFormProps> = ({
  onFinish = () => {},
  onDataSourceSelect = () => {},
  onTestConnection = () => {},
  onDataSourceSetupSubmit = () => {},
  onDataModelGenerationSubmit = () => {},
  onSkip,
  onChangeStep,
  bordered = true,
  loading = false,
  shadow = true,
  copyFromOptions = [],
  onCopyFrom,
}) => {
  const { t } = useTranslation(["dataSourceStepForm"]);
  const { step } = DataSourceStore();

  return (
    <Card
      style={{
        boxShadow: shadow === false ? "0 0 0 0" : undefined,
      }}
      bordered={bordered}
    >
      {onChangeStep && (
        <div className={styles.header}>
          <StepFormHeader
            currentStep={step}
            steps={[t("step1"), t("step2"), t("step3"), t("step4")]}
            onChange={onChangeStep}
          />
        </div>
      )}
      <Suspense fallback={<BouncingDotsLoader />}>
        <DataSourceFormBody
          loading={loading}
          onSkip={onSkip}
          onFinish={onFinish}
          onChangeStep={onChangeStep}
          onDataSourceSelect={onDataSourceSelect}
          onTestConnection={onTestConnection}
          onDataSourceSetupSubmit={onDataSourceSetupSubmit}
          onDataModelGenerationSubmit={onDataModelGenerationSubmit}
          copyFromOptions={copyFromOptions}
          onCopyFrom={onCopyFrom}
        />
      </Suspense>
    </Card>
  );
};

export default DataSourceForm;
