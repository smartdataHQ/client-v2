import { Layout, Row, Col } from "antd";
import { useResponsive } from "ahooks";
import cx from "classnames";

import styles from "./index.module.less";

const { Footer: BasicFooter } = Layout;

const Footer: React.FC = () => {
  const responsive = useResponsive();
  const isMobile = responsive.md === false;

  return (
    <>
      <BasicFooter className={styles.footer}>
        <Row>
          <Col span={24}>
            {/* <Row
              justify="space-between"
              className={cx(
                styles.footerTextContainer,
                isMobile && styles.footerMobile
              )}
            >
              <Col xs={24} sm={24} md={12}>
                <div className={styles.footerTitle} />
                <div className={styles.footerText}>
                  © 2024 FraiOS. All rights reserved.
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} className={styles.footerContactUs}>
                <div className={styles.footerText}>
                  Contact us:{" "}
                  <span>
                    <a
                      className={styles.footerLink}
                      href="mailto:hello@fraios.com"
                    >
                      hello@fraios.com
                    </a>
                  </span>
                  <div style={{ height: 10 }} />
                </div>
              </Col>
            </Row> */}
          </Col>
        </Row>
      </BasicFooter>
    </>
  );
};

export default Footer;
