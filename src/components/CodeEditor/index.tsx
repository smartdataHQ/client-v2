import { Col, Row, Space, Tooltip } from "antd";
import Scrollbar from "react-custom-scrollbars";
import { CloseOutlined, SyncOutlined } from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { useTranslation } from "react-i18next";
import { useResponsive, useSize, useTrackedEffect } from "ahooks";
import moment from "moment";
import cn from "classnames";

import Button from "@/components/Button";
import NoModels from "@/components/NoModels";
import SQLRunner from "@/components/SQLRunner";
import Console from "@/components/Console";
import { MONACO_OPTIONS } from "@/utils/constants/monaco";
import type { Dataschema } from "@/types/dataschema";
import equals from "@/utils/helpers/equals";
import { createCompletionProvider } from "@/utils/cubejs-language/completionProvider";
import { createDiagnosticProvider } from "@/utils/cubejs-language/diagnosticProvider";
import { createHoverProvider } from "@/utils/cubejs-language/hoverProvider";
import { cubeJsSpec, CUBEJS_SPEC_VERSION } from "@/utils/cubejs-language/spec";
import { parseYamlDocument } from "@/utils/cubejs-language/yamlParser";
import { parseJsDocument } from "@/utils/cubejs-language/jsParser";
import { CubeRegistry } from "@/utils/cubejs-language/registry";
import { isSmartGenerated, parseProvenance } from "@/utils/provenanceParser";

import SaveIcon from "@/assets/save.svg";

import RegenerateModal from "./RegenerateModal";

import styles from "./index.module.less";

import type { MergeStrategy } from "./RegenerateModal";
import type { FC } from "react";

interface CodeEditorProps {
  schemas?: Dataschema[];
  active?: string | null;
  onTabChange: (dataschema?: Dataschema) => void;
  onClose: (fileName: string) => void;
  onRunSQL: (query: string, limit: number) => void;
  onCodeSave: (files: Partial<Dataschema>[]) => void;
  onRegenerate?: (
    strategy: MergeStrategy,
    sourceTable: string,
    sourceDatabase: string
  ) => void;
  isRegenerating?: boolean;
  data?: object[];
  sqlError?: object;
  showConsole?: boolean;
  toggleConsole?: () => void;
  validationError: string;
  cubeRegistry?: CubeRegistry;
  onRefreshRegistry?: () => void;
}

const languages = {
  js: "javascript",
  yml: "yaml",
};

const CodeEditor: FC<CodeEditorProps> = ({
  schemas = [],
  active,
  onClose,
  onTabChange,
  onRunSQL,
  onCodeSave,
  onRegenerate,
  isRegenerating = false,
  data,
  sqlError = {},
  showConsole = false,
  toggleConsole = () => {},
  validationError,
  cubeRegistry,
  onRefreshRegistry,
}) => {
  const { t } = useTranslation(["models", "common"]);
  const pageHeader = useRef(null);
  const editorHeader = useRef(null);
  const completionDisposableRef = useRef<any>(null);
  const hoverDisposableRef = useRef<any>(null);
  const diagnosticProviderRef = useRef<ReturnType<
    typeof createDiagnosticProvider
  > | null>(null);
  const editorInstanceRef = useRef<any>(null);
  const monacoInstanceRef = useRef<any>(null);
  const [specVersionWarning, setSpecVersionWarning] = useState<string | null>(
    null
  );
  const [showRegenerateModal, setShowRegenerateModal] =
    useState<boolean>(false);

  // Create a default registry if none provided
  const registryRef = useRef<CubeRegistry>(cubeRegistry ?? new CubeRegistry());
  if (cubeRegistry) {
    registryRef.current = cubeRegistry;
  }
  const windowSize = useResponsive();
  const isMd = windowSize?.md;

  const bodySize = useSize(document.body);
  const headerSize = useSize(document.getElementById("header"));
  const pageHeaderSize = useSize(pageHeader.current);

  const editorHeight =
    bodySize?.height && headerSize?.height
      ? Math.max(
          bodySize.height -
            headerSize.height -
            (pageHeaderSize?.height || 0) -
            91,
          300
        )
      : 500;

  const [limit, setLimit] = useState<number>(1000);
  const [query, setQuery] = useState<string>("SELECT id FROM users");
  const [showData, setShowData] = useState<boolean>(false);

  const files = schemas?.reduce(
    (res, schema) => ({
      ...res,
      [schema.name]: schema,
    }),
    {}
  ) as Record<string, Dataschema>;

  const getFilesContent = () => {
    return schemas?.reduce(
      (acc, s) => ({ ...acc, [s.name]: s.code }),
      {} as Record<string, string>
    );
  };

  const [content, setContent] = useState<Record<string, string>>(
    getFilesContent()
  );

  // Determine if the active file is a YAML smart-generated model
  const activeFileExt = active ? active.split(".").pop()?.toLowerCase() : null;
  const isYamlFile = activeFileExt === "yml" || activeFileExt === "yaml";
  const activeContent = active && content?.[active] ? content[active] : "";
  const showRegenerateButton =
    isYamlFile && isSmartGenerated(activeContent) && !!onRegenerate;

  const activeProvenance = showRegenerateButton
    ? parseProvenance(activeContent)
    : null;

  const onRun = () => {
    if (!showData) {
      setShowData(true);
    }

    onRunSQL(query, limit);
  };

  const onSave = async () => {
    const newFiles: Partial<Dataschema>[] = Object.entries(content).map(
      ([name, code]) => ({ name, code })
    );
    await onCodeSave(newFiles);

    // Trigger backend validation via diagnostic provider
    if (diagnosticProviderRef.current && active && active !== "sqlrunner") {
      const filesForValidation = Object.entries(content).map(
        ([fileName, fileContent]) => ({ fileName, content: fileContent })
      );
      const backendDiags = await diagnosticProviderRef.current.onSave(
        filesForValidation,
        active
      );

      // Apply backend diagnostics as markers on current model
      if (monacoInstanceRef.current && editorInstanceRef.current) {
        const model = editorInstanceRef.current.getModel();
        if (model && backendDiags.length > 0) {
          const monaco = monacoInstanceRef.current;
          const markers = backendDiags.map((d: any) => ({
            severity:
              d.severity === "error"
                ? monaco.MarkerSeverity.Error
                : monaco.MarkerSeverity.Warning,
            message: d.message,
            startLineNumber: d.startLineNumber,
            startColumn: d.startColumn,
            endLineNumber: d.endLineNumber,
            endColumn: d.endColumn,
          }));
          monaco.editor.setModelMarkers(model, "cubejs-backend", markers);
        }
      }
    }

    // Refresh cube registry after save (FR-014)
    if (onRefreshRegistry) {
      onRefreshRegistry();
    }
  };

  const handleRegenerate = (strategy: MergeStrategy) => {
    if (onRegenerate && activeProvenance) {
      onRegenerate(
        strategy,
        activeProvenance.sourceTable || "",
        activeProvenance.sourceDatabase || ""
      );
    }
    setShowRegenerateModal(false);
  };

  useTrackedEffect(
    (changes, previousDeps, currentDeps) => {
      const isSchemasChanged = !equals(previousDeps?.[0], currentDeps?.[0]);

      if (active && isSchemasChanged) {
        const updatedCode = getFilesContent();
        setContent(updatedCode);
      }
    },
    [schemas]
  );

  // Clean up completion and diagnostic providers on unmount
  useTrackedEffect(() => {
    return () => {
      if (completionDisposableRef.current) {
        completionDisposableRef.current.dispose();
        completionDisposableRef.current = null;
      }
      if (hoverDisposableRef.current) {
        hoverDisposableRef.current.dispose();
        hoverDisposableRef.current = null;
      }
      if (diagnosticProviderRef.current) {
        diagnosticProviderRef.current.dispose();
        diagnosticProviderRef.current = null;
      }
    };
  }, []);

  const handleEditorMount = (_editor: any, monaco: any) => {
    editorInstanceRef.current = _editor;
    monacoInstanceRef.current = monaco;

    // Dispose previous registration if any
    if (completionDisposableRef.current) {
      completionDisposableRef.current.dispose();
    }

    const provider = createCompletionProvider(registryRef.current);

    // Register for both YAML and JavaScript
    const yamlDisposable = monaco.languages.registerCompletionItemProvider(
      "yaml",
      provider
    );
    const jsDisposable = monaco.languages.registerCompletionItemProvider(
      "javascript",
      provider
    );

    // Store a combined disposable
    completionDisposableRef.current = {
      dispose() {
        yamlDisposable.dispose();
        jsDisposable.dispose();
      },
    };

    // Register hover provider
    if (hoverDisposableRef.current) {
      hoverDisposableRef.current.dispose();
    }
    const hoverProvider = createHoverProvider(cubeJsSpec, registryRef.current);
    const yamlHoverDisposable = monaco.languages.registerHoverProvider(
      "yaml",
      hoverProvider
    );
    const jsHoverDisposable = monaco.languages.registerHoverProvider(
      "javascript",
      hoverProvider
    );
    hoverDisposableRef.current = {
      dispose() {
        yamlHoverDisposable.dispose();
        jsHoverDisposable.dispose();
      },
    };

    // Create diagnostic provider
    if (diagnosticProviderRef.current) {
      diagnosticProviderRef.current.dispose();
    }
    diagnosticProviderRef.current = createDiagnosticProvider(cubeJsSpec, {
      setMarkers: (model: unknown, owner: string, markers: any[]) => {
        const monacoMarkers = markers.map((m) => ({
          severity:
            m.severity === "error"
              ? monaco.MarkerSeverity.Error
              : monaco.MarkerSeverity.Warning,
          message: m.message,
          startLineNumber: m.startLineNumber,
          startColumn: m.startColumn,
          endLineNumber: m.endLineNumber,
          endColumn: m.endColumn,
        }));
        monaco.editor.setModelMarkers(model as any, owner, monacoMarkers);
      },
    });

    // Wire up content change listener for diagnostics
    const model = _editor.getModel();
    if (model && diagnosticProviderRef.current) {
      const parseForModel = (modelContent: string) => {
        const path = model.uri?.path || "";
        if (path.endsWith(".yml") || path.endsWith(".yaml")) {
          return parseYamlDocument(modelContent);
        }
        return parseJsDocument(modelContent);
      };
      // Run initial validation
      diagnosticProviderRef.current.onContentChange(model, parseForModel);
      // Listen for subsequent changes
      _editor.onDidChangeModelContent(() => {
        if (diagnosticProviderRef.current) {
          diagnosticProviderRef.current.onContentChange(model, parseForModel);
        }
      });
    }

    // Version check against CubeJS backend
    fetch("/api/v1/version")
      .then((res) => (res.ok ? res.json() : null))
      .then((versionData) => {
        if (versionData?.version) {
          const [bMajor, bMinor] = versionData.version.split(".").map(Number);
          const [sMajor, sMinor] = CUBEJS_SPEC_VERSION.split(".").map(Number);
          if (bMajor !== sMajor || bMinor !== sMinor) {
            const msg = `Cube.js spec version mismatch: editor spec ${CUBEJS_SPEC_VERSION}, backend ${versionData.version}`;
            console.warn(msg);
            setSpecVersionWarning(msg);
          }
        }
      })
      .catch(() => {
        // Version check is best-effort; ignore failures
      });
  };

  const language = active
    ? languages[active.split(".").pop() as keyof typeof languages]
    : "sql";

  const header = (
    <Scrollbar
      style={{
        width: "100%",
        height: "57px",
        background: "#f9f9f9",
      }}
      hideTracksWhenNotNeeded
      autoHide
      renderThumbHorizontal={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: "#C1BFC1",
            height: "4px",
            borderRadius: "2px",
            bottom: -1,
          }}
        />
      )}
    >
      <Space className={styles.nav} size={8} ref={pageHeader}>
        <Button
          className={cn(styles.btn, styles.sqlRunner, {
            [styles.active]: active === "sqlrunner",
          })}
          key="sqlrunner"
          onClick={() => onTabChange()}
        >
          {t("common:words.sql_runner")}
        </Button>
        {files &&
          Object.keys(files).map((name) => (
            <Button
              type="default"
              key={name}
              className={cn(styles.btn, {
                [styles.active]: active && name === active,
              })}
              onClick={() => onTabChange(files[name])}
            >
              {files[name].name} {files[name].code !== content?.[name] && "*"}
              <Tooltip title={t("common:words.close")}>
                <CloseOutlined
                  className={styles.closeIcon}
                  data-testid="close-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose(name);
                  }}
                />
              </Tooltip>
            </Button>
          ))}
      </Space>
    </Scrollbar>
  );

  if (!active) {
    return (
      <div className={styles.wrapper}>
        {header}
        <NoModels />
      </div>
    );
  }

  return (
    <div className={styles.wrapper} data-testid="code-editor">
      {header}
      {active && active !== "sqlrunner" ? (
        <div>
          <div className={styles.editorHeader} ref={editorHeader}>
            <Row
              className={styles.editorHeaderInner}
              align={"middle"}
              justify={"space-between"}
              gutter={[16, 16]}
            >
              <Col>
                {(files[active]?.updated_at || files[active]?.created_at) && (
                  <span className={cn(!isMd && styles.modifyMobile)}>
                    {t("models:last_modify")}{" "}
                    {moment(
                      files[active]?.updated_at || files[active]?.created_at
                    ).fromNow()}
                  </span>
                )}
              </Col>
              <Col>
                <Space size={8}>
                  {showRegenerateButton && (
                    <Button
                      className={cn(styles.save)}
                      onClick={() => setShowRegenerateModal(true)}
                      icon={<SyncOutlined />}
                    >
                      Regenerate
                    </Button>
                  )}
                  <Button
                    className={cn(styles.save)}
                    onClick={() => active && onSave()}
                    icon={<SaveIcon />}
                  >
                    {t("common:words.save")}
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
          {specVersionWarning && (
            <div
              style={{
                padding: "4px 12px",
                background: "#fff7e6",
                borderBottom: "1px solid #ffd591",
                fontSize: 12,
                color: "#ad6800",
              }}
            >
              {specVersionWarning}
            </div>
          )}
          <div className={styles.monacoWrapper}>
            <Editor
              className={styles.monaco}
              language={language}
              defaultLanguage={language}
              defaultValue={content?.[active]}
              value={content?.[active]}
              onChange={(val) =>
                setContent((prev) => ({ ...prev, [active]: val || " " }))
              }
              onMount={handleEditorMount}
              path={files[active]?.name}
              options={MONACO_OPTIONS}
              height={editorHeight}
            />
            {showConsole && active !== "sqlrunner" && (
              <div className={styles.console}>
                <Console
                  onClose={() => toggleConsole?.()}
                  errors={validationError}
                />
              </div>
            )}
          </div>
          <RegenerateModal
            visible={showRegenerateModal}
            onCancel={() => setShowRegenerateModal(false)}
            onRegenerate={handleRegenerate}
            sourceTable={activeProvenance?.sourceTable || ""}
            sourceDatabase={activeProvenance?.sourceDatabase || ""}
            isRegenerating={isRegenerating}
          />
        </div>
      ) : (
        <SQLRunner
          value={query}
          onChange={setQuery}
          showData={showData}
          data={data}
          sqlError={sqlError}
          limit={limit}
          onChangeLimit={setLimit}
          onRun={onRun}
        />
      )}
    </div>
  );
};

export default CodeEditor;
