import { Row, Col, message } from "antd";
import { useParams } from "@vitjs/runtime";
import { useResponsive } from "ahooks";

import DataSourceForm from "@/components/DataSourceForm";
import Navbar from "@/components/Navbar";
import BasicLayout from "@/layouts/BasicLayout";
import useLocation from "@/hooks/useLocation";
import useOnboarding from "@/hooks/useOnboarding";
import usePortalAdmin from "@/hooks/usePortalAdmin";
import useAllTeamDatasources from "@/hooks/useAllTeamDatasources";
import DataSourceStore from "@/stores/DataSourceStore";
import CurrentUserStore from "@/stores/CurrentUserStore";
import { useCopyDatasourceMutation } from "@/graphql/generated";
import { userMenu } from "@/mocks/user";
import type {
  DataSource,
  DataSourceSetupForm,
  DynamicForm,
} from "@/types/dataSource";
import { MODELS, ONBOARDING, SOURCES } from "@/utils/constants/paths";

import styles from "./index.module.less";

interface CopyFromOption {
  id: string;
  name: string;
  teamName: string;
  dbType: string;
}

interface OnboardingProps {
  loading: boolean;
  onSkip: () => void;
  onFinish: () => void;
  onDataSourceSelect: (data: DataSource) => void;
  onTestConnection: (data: DataSourceSetupForm) => void;
  onDataSourceSetupSubmit: (data: DataSourceSetupForm) => void;
  onDataModelGenerationSubmit: (data: DynamicForm) => void;
  onChangeStep: (value: number) => void;
  copyFromOptions?: CopyFromOption[];
  onCopyFrom?: (datasourceId: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({
  loading = false,
  onSkip = () => {},
  onFinish = () => {},
  onChangeStep = () => {},
  onTestConnection = () => {},
  onDataSourceSelect = () => {},
  onDataSourceSetupSubmit = () => {},
  onDataModelGenerationSubmit = () => {},
  copyFromOptions = [],
  onCopyFrom,
}) => {
  const responsive = useResponsive();
  const { currentUser } = CurrentUserStore();

  const header = (
    <Navbar
      username={currentUser.displayName}
      userAvatar={currentUser.avatarUrl}
      userMenu={userMenu}
      teams={currentUser.teams}
      type={!responsive.lg ? "dropdown" : "inline"}
    />
  );

  return (
    <BasicLayout header={header} disableMenu>
      <Row className={styles.container}>
        <Col xs={24}>
          <DataSourceForm
            bordered
            onSkip={onSkip}
            onChangeStep={onChangeStep}
            loading={loading}
            onFinish={onFinish}
            onDataSourceSelect={onDataSourceSelect}
            onTestConnection={onTestConnection}
            onDataSourceSetupSubmit={onDataSourceSetupSubmit}
            onDataModelGenerationSubmit={onDataModelGenerationSubmit}
            copyFromOptions={copyFromOptions}
            onCopyFrom={onCopyFrom}
          />
        </Col>
      </Row>
    </BasicLayout>
  );
};

const OnboardingWrapper = () => {
  const { step: pageStep } = useParams();
  const [, setLocation] = useLocation();
  const basePath = ONBOARDING;

  const step = useMemo(() => parseInt(pageStep || "0", 10) - 1, [pageStep]);

  const {
    formState: { step0, step1 },
    isOnboarding,
    setIsOnboarding,
    setStep,
    setFormStateData,
    clean,
  } = DataSourceStore();

  const { loading, onDataSourceSetupSubmit, onDataModelGenerationSubmit } =
    useOnboarding({});

  const { isPortalAdmin } = usePortalAdmin();
  const { datasources: otherTeamDs } = useAllTeamDatasources();
  const { currentTeam } = CurrentUserStore();
  const [, execCopyMutation] = useCopyDatasourceMutation();

  const onCopyFrom = async (datasourceId: string) => {
    if (!currentTeam?.id) return;
    const result = await execCopyMutation({
      datasource_id: datasourceId,
      target_team_id: currentTeam.id,
    });
    if (result.data?.copy_datasource?.id) {
      message.success("Datasource copied successfully");
      clean();
      setLocation(SOURCES);
    } else if (result.error) {
      message.error(result.error.message);
    }
  };

  const onFinish = () => {
    clean();
    setLocation(MODELS);
  };

  const onChangeStep = (value: number) => {
    setLocation(`${basePath}/${value + 1}`);
  };

  const onNextStep = () => {
    setLocation(`${basePath}/${step + 2}`);
  };

  const onDataSourceSelect = (value: DataSource) => {
    setFormStateData(0, value);
    onNextStep();
  };

  const onSkip = () => {
    clean();
    setLocation(SOURCES);
  };

  const onDatasourceSetup = async (data: DataSourceSetupForm) => {
    await onDataSourceSetupSubmit(data, false, onNextStep);
  };

  const onDataModelGeneration = async (data: DynamicForm) => {
    const isSuccess = await onDataModelGenerationSubmit(data);

    if (isSuccess) {
      onNextStep();
    }
  };

  const onTestConnection = async (data: DataSourceSetupForm) => {
    await onDataSourceSetupSubmit(data, true, onNextStep);
  };

  useEffect(() => {
    if (step >= 0) {
      setStep(step);
    }
  }, [setStep, step]);

  useEffect(() => {
    if (step < 0 || step > 4 || isNaN(step)) {
      setLocation(`${basePath}/1`);
    }
  }, [basePath, setLocation, step]);

  useEffect(() => {
    if (step > 0 && !step0) {
      setLocation(`${basePath}/1`);
    } else if (step > 1 && !step1) {
      setLocation(`${basePath}/2`);
    }
  }, [basePath, setLocation, step, step0, step1]);

  useEffect(() => {
    if (!isOnboarding) {
      setIsOnboarding(true);
    }
  }, [isOnboarding, setIsOnboarding]);

  useEffect(() => () => clean(), [clean]);

  return (
    <Onboarding
      loading={loading}
      onSkip={onSkip}
      onFinish={onFinish}
      onChangeStep={onChangeStep}
      onDataSourceSelect={onDataSourceSelect}
      onTestConnection={onTestConnection}
      onDataSourceSetupSubmit={onDatasourceSetup}
      onDataModelGenerationSubmit={onDataModelGeneration}
      copyFromOptions={isPortalAdmin ? otherTeamDs : []}
      onCopyFrom={isPortalAdmin ? onCopyFrom : undefined}
    />
  );
};

export default OnboardingWrapper;
