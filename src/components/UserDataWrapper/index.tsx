import useUserData from "@/hooks/useUserData";
import PageLoading from "@/components/PageLoading";

import type { ReactNode } from "react";

export type UserDataWrapperProps = {
  children: ReactNode;
};

const UserDataWapper: React.FC<UserDataWrapperProps> = ({ children }) => {
  const { bootstrapping } = useUserData();

  if (bootstrapping) {
    return <PageLoading />;
  }

  return <>{children}</>;
};

export default UserDataWapper;
