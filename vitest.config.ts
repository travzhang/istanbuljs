import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["packages/**/src/**/*.ts"],
      exclude: ["packages/istanbul-lib-report/src/reports/**"],
    },
    projects: ["packages/*"],
  },
});
