import path from "path";
import fs from "fs";
import { createRequire } from "module";

// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default, import/no-named-as-default-member
import react from "@vitejs/plugin-react";
import vitApp from "@vitjs/vit";
import { visualizer } from "rollup-plugin-visualizer";
import autoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import windiCSS from "vite-plugin-windicss";
import svgx from "@svgx/vite-plugin-react";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import copy from "rollup-plugin-copy";

import routes from "./config/routes";

const _require = createRequire(import.meta.url);

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
function reactVirtualized() {
  return {
    name: "my:react-virtualized",
    configResolved() {
      const file = _require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      fs.writeFileSync(file, modified);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    copy({
      hook: "buildStart",
      targets: [
        {
          src: "node_modules/monaco-editor/min/vs",
          dest: "public/monaco-editor/min",
        },
      ],
    }),
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"],
        },
      },
    }),
    autoImport({
      imports: [
        "react",
        {
          react: [
            "createElement",
            "cloneElement",
            "createContext",
            "useLayoutEffect",
            "forwardRef",
          ],
        },
      ],
    }),
    vitApp({
      routes,
      reactStrictMode: false,
      dynamicImport: {
        loading: "./components/PageLoading",
      },
      exportStatic: {},
    }),
    windiCSS(),
    visualizer(),
    svgx(),
    monacoEditorPlugin({}),
    reactVirtualized(),
    pluginRewriteAll(),
  ],
  server: {
    port: 8000,
    proxy: {
      "/v1/graphql": "http://localhost:8080",
      "/v1/ws": {
        target: "ws://localhost:8080",
        ws: true,
        changeOrigin: true,
        rewrite: (p) => p.replace("/ws", "/graphql"),
      },
      "/auth": "http://localhost:3000",
      "/api/v1": "http://localhost:4000",
    },
  },
  resolve: {
    tsconfigPaths: true,
    preserveSymlinks: true,
    alias: [
      // { find: '@', replacement: path.resolve(__dirname, 'src') },
      // fix less import by: @import ~
      // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
      { find: /^~/, replacement: "" },
    ],
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      less: {
        // modifyVars: { 'primary-color': '#13c2c2' },
        // modifyVars: getThemeVariables({
        //   // dark: true, // 开启暗黑模式
        //   // compact: true, // 开启紧凑模式
        // }),
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: "react-venders",
              test: /[\\/]node_modules[\\/](react|react-dom|@vitjs[\\/]runtime)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
