import type { editor } from "monaco-editor";

export const MONACO_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  autoIndent: "full",
  automaticLayout: true,
  contextmenu: true,
  fontFamily: "monospace",
  fontSize: 13,
  lineHeight: 24,
  hideCursorInOverviewRuler: true,
  matchBrackets: "always",
  fontLigatures: "",
  detectIndentation: true,
  insertSpaces: true,
  tabSize: 2,
  wordWrap: "on",
  minimap: {
    enabled: false,
  },
  readOnly: false,
  fixedOverflowWidgets: true,
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "multiline",
    seedSearchStringFromSelection: "selection",
  },
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 4,
  },
  bracketPairColorization: {
    enabled: true,
  },
  guides: {
    indentation: true,
    bracketPairs: true,
  },
  formatOnPaste: true,
  suggest: {
    showKeywords: true,
    showSnippets: true,
    preview: true,
    insertMode: "replace",
  },
  quickSuggestions: {
    other: true,
    strings: true,
    comments: false,
  },
};
