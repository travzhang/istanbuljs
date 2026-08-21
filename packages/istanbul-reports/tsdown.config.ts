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
    { from: "src/html/assets", to: "dist/html" },
    { from: "src/html-spa/assets", to: "dist/html-spa" },
  ],
});
