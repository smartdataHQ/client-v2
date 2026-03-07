import { Space } from "antd";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import useLocation from "@/hooks/useLocation";
import { SIGNIN, SIGNUP } from "@/utils/constants/paths";

import styles from "./index.module.less";

import type { FC } from "react";

interface AuthLinksProps {
  currentPage?: string;
}

const AuthLinks: FC<AuthLinksProps> = ({ currentPage }) => {
  const { t } = useTranslation(["common"]);
  const [, setLocation] = useLocation();
  const [signupEnabled, setSignupEnabled] = useState(false);

  useEffect(() => {
    fetch("/auth/config")
      .then((r) => r.json())
      .then((data) => setSignupEnabled(data.signupEnabled === true))
      .catch(() => setSignupEnabled(false));
  }, []);

  return (
    <Space>
      {currentPage !== "signin" && (
        <Button
          className={styles.btn}
          type={currentPage === "signup" ? "primary" : "link"}
          onClick={() => setLocation(SIGNIN)}
        >
          {currentPage === "signup"
            ? t("common:words.login")
            : t("common:words.sign_in")}
        </Button>
      )}
      {signupEnabled && currentPage !== "signup" && (
        <Button
          className={styles.btn}
          type="primary"
          onClick={() => setLocation(SIGNUP)}
        >
          {t("common:words.sign_up")}
        </Button>
      )}
    </Space>
  );
};

export default AuthLinks;
