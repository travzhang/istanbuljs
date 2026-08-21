import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["packages/**/index.js", "packages/**/lib/**/*.js"],
      exclude: ["**/istanbul-reports/**"],
    },
    projects: ["packages/*"],
  },
});
