import { Result } from "antd";
import { useTranslation } from "react-i18next";

import useAuth from "@/hooks/useAuth";
import BasicLayout from "@/layouts/BasicLayout";
import Button from "@/components/Button";

import s from "./index.module.less";

const Logout: React.FC = () => {
  const { t } = useTranslation(["logout"]);
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, []);

  return (
    <BasicLayout>
      <Result
        className={s.wrapper}
        status="success"
        title={t("title")}
        subTitle={t("subtitle")}
        extra={[
          <Button type="primary" key="back" onClick={() => window.close()}>
            {t("action")}
          </Button>,
        ]}
      />
    </BasicLayout>
  );
};

export default Logout;
