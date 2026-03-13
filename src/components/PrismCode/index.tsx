import { Empty, Typography } from "antd";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-solarizedlight.css";

import s from "./index.module.less";

import type { FC } from "react";

interface PrismCodeProps {
  code: string;
  lang: string;
  style?: object;
}

const { Text } = Typography;

const PrismCode: FC<PrismCodeProps> = ({ code, lang = "sql", style }) => {
  const [htmlContent, setContent] = useState("");

  useEffect(() => {
    const html = Prism.highlight(code, Prism.languages[lang], lang);
    setContent(html);
  }, [code, lang]);

  if (!code) {
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Data"} />
    );
  }

  return (
    <div className={s.container}>
      <pre style={style}>
        <Text
          code
          copyable={{ text: code }}
          style={{ background: "none", border: "none" }}
        >
          <div
            style={{ display: "inline", lineHeight: 1 }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Text>
      </pre>
    </div>
  );
};

export default PrismCode;
