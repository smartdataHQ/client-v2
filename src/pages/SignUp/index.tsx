import BasicLayout from "@/layouts/BasicLayout";
import AuthLinks from "@/components/AuthLinks";

const SignUp: React.FC = () => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/auth/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.signupEnabled) {
          window.location.href = "/auth/signin?signup=true";
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <BasicLayout header={<AuthLinks currentPage="signup" />}>
        <div style={{ textAlign: "center", padding: "48px" }}>Loading...</div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout header={<AuthLinks currentPage="signup" />}>
      <div style={{ textAlign: "center", padding: "48px" }}>
        Account registration is currently disabled. Please contact your
        administrator.
      </div>
    </BasicLayout>
  );
};

export default SignUp;
