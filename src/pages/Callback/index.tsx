import { Result, Spin } from "antd";

import BasicLayout from "@/layouts/BasicLayout";
import { EXPLORE } from "@/utils/constants/paths";

import s from "./index.module.less";

const Callback: React.FC = () => {
  useEffect(() => {
    // The auth callback is now handled server-side by the Actions service.
    // If the user lands here, redirect to the main app.
    window.location.href = EXPLORE;
  }, []);

  return (
    <BasicLayout>
      <Result
        className={s.wrapper}
        icon={<Spin size="large" />}
        title="Authenticating..."
        subTitle="Please wait while we complete sign-in."
      />
    </BasicLayout>
  );
};

export default Callback;
