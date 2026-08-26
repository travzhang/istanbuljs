import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

import { reportDataDevPlugin } from "./vite-plugin-report-data-dev.js";

const require = createRequire(import.meta.url);
const packageRoot = dirname(fileURLToPath(import.meta.url));
const monacoCss = join(
  dirname(require.resolve("monaco-editor")),
  "../../min/vs/editor/editor.main.css",
);

/** Single-file HTML report page → `dist/index.html` */
export default defineConfig({
  root: packageRoot,
  plugins: [react(), reportDataDevPlugin(), viteSingleFile()],
  resolve: {
    alias: {
      "monaco-editor-css": monacoCss,
    },
  },
  build: {
    outDir: join(packageRoot, "dist"),
    emptyOutDir: false,
  },
  server: {
    port: 51025,
  },
});
