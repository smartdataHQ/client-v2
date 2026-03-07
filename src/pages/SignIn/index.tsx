import { Row, Col } from "antd";

import BasicLayout from "@/layouts/BasicLayout";
import SignInForm from "@/components/SignInForm";
import AuthLinks from "@/components/AuthLinks";

import styles from "./index.module.less";

const SignIn: React.FC = () => {
  return (
    <BasicLayout header={<AuthLinks currentPage="signin" />}>
      <Row className={styles.container} justify="center" align="middle">
        <Col xs={24} style={{ maxWidth: 356 }}>
          <SignInForm />
        </Col>
      </Row>
    </BasicLayout>
  );
};

export default SignIn;
