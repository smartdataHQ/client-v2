import { Alert, Space } from "antd";
import { useTranslation } from "react-i18next";

import type { GeneralInfo } from "@/components/GeneralInfoForm";
import GeneralInfoForm from "@/components/GeneralInfoForm";
import LogoutSessions from "@/components/LogoutSessions";
import useAuth from "@/hooks/useAuth";
import CurrentUserStore from "@/stores/CurrentUserStore";

import styles from "./index.module.less";

export type PersonalInfoProps = {
  initialValue?: GeneralInfo;
  error?: string | null;
  onLogout?: () => void;
};

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  initialValue,
  error,
  onLogout = () => {},
}) => {
  const { t } = useTranslation(["settings", "pages"]);

  return (
    <>
      <Space className={styles.wrapper} direction="vertical" size={25}>
        {error && <Alert type="error" message={error} />}
        <GeneralInfoForm
          initialValue={initialValue}
          onSubmit={() => {}}
          disabled
        />
        <LogoutSessions onSubmit={onLogout} />
      </Space>
    </>
  );
};

const PersonalInfoWrapper = () => {
  const { signOut } = useAuth();
  const { currentUser } = CurrentUserStore();

  const onLogout = async () => {
    await signOut();
  };

  const initialValue = {
    displayName: currentUser?.displayName || "",
    email: currentUser?.email || "",
  };

  return <PersonalInfo initialValue={initialValue} onLogout={onLogout} />;
};

export default PersonalInfoWrapper;
