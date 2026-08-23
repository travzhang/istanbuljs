import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  tsconfig: "./tsconfig.json",
  target: "esnext",
  clean: true,
  unbundle: true,

  minify: {
    codegen: { removeWhitespace: false },
    compress: true,
    mangle: { keepNames: true },
  },
  outputOptions: { comments: false },

  dts: true,

  copy: [
    { from: "src/reports/html/assets", to: "dist/reports/html" },
    { from: "src/reports/html-spa/assets", to: "dist/reports/html-spa" },
  ],
});
