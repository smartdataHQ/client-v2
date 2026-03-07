import type { FC } from "react";

export interface SignUpFormType {
  email: string;
  password?: string;
  privacy?: boolean;
}

interface SignUpProps {
  isMagicLink?: boolean;
  loading?: boolean;
  onSubmit?: (data: SignUpFormType) => void;
}

const SignUpForm: FC<SignUpProps> = () => {
  useEffect(() => {
    window.location.href = "/auth/signin?signup=true";
  }, []);

  return <div>Redirecting to sign up...</div>;
};

export default SignUpForm;
