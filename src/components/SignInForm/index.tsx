import { Typography, Button, Input, Space, Divider, Alert } from "antd";
import { useTranslation } from "react-i18next";

import useLocation from "@/hooks/useLocation";
import { SIGNUP } from "@/utils/constants/paths";

import styles from "./index.module.less";

import type { FC } from "react";

const { Title, Text } = Typography;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  session_expired: "Your session has expired. Please sign in again.",
  access_denied: "Access was denied. Please try again or contact your admin.",
  callback_failed:
    "Sign-in could not be completed due to a server error. Please try again.",
  unauthorized:
    "You are not authorized to access this resource. Please sign in.",
  signup_disabled:
    "Account registration is currently disabled. Please contact your administrator.",
};

interface SignInFormProps {
  error?: string | null;
}

const SignInForm: FC<SignInFormProps> = ({ error }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [, setLocation] = useLocation();
  const { t } = useTranslation(["sign", "common"]);

  // Fetch auth config to check if signup is enabled
  useEffect(() => {
    fetch("/auth/config")
      .then((r) => r.json())
      .then((data) => setSignupEnabled(data.signupEnabled === true))
      .catch(() => setSignupEnabled(false));
  }, []);

  // Read error from URL on mount
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error") || error;
    if (errorCode) {
      setErrorMessage(
        AUTH_ERROR_MESSAGES[errorCode] ||
          "Something went wrong. Please try again."
      );
      // Clean error from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [error]);

  const handleSSOSignin = () => {
    if (!email.trim()) return;
    setIsLoading(true);
    const params = new URLSearchParams({ email: email.trim() });
    window.location.href = `/auth/signin?${params.toString()}`;
  };

  const handleProviderSignin = (provider: string) => {
    window.location.href = `/auth/signin?provider=${provider}`;
  };

  const handleCreateAccount = () => {
    window.location.href = "/auth/signin?signup=true";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title level={2}>{t("sign_in.title")}</Title>
        <Text className={styles.desc}>{t("sign_in.text")}!</Text>
      </div>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          closable
          onClose={() => setErrorMessage(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          type="email"
          placeholder={t("common:form.placeholders.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onPressEnter={handleSSOSignin}
          disabled={isLoading}
          size="large"
        />

        <Button
          type="primary"
          block
          size="large"
          loading={isLoading}
          disabled={isLoading || !email.trim()}
          onClick={handleSSOSignin}
        >
          Continue with SSO
        </Button>

        <Divider>Or continue with:</Divider>

        <Space
          style={{ width: "100%", justifyContent: "center" }}
          size="middle"
        >
          <Button onClick={() => handleProviderSignin("google")}>Google</Button>
          <Button onClick={() => handleProviderSignin("github")}>GitHub</Button>
          <Button onClick={() => handleProviderSignin("linkedin")}>
            LinkedIn
          </Button>
        </Space>

        {signupEnabled && (
          <>
            <Divider />

            <Button
              type="primary"
              block
              size="large"
              onClick={handleCreateAccount}
            >
              Create a new account
            </Button>

            <Text className={styles.text}>
              Already have an account?{" "}
              <Button
                className={styles.link}
                type="link"
                onClick={() => setLocation(SIGNUP)}
              >
                {t("sign_in.sign_up_link")}
              </Button>
            </Text>
          </>
        )}
      </Space>
    </div>
  );
};

export default SignInForm;

export type { SignInFormProps };
