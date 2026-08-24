import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["packages/**/src/**/*.ts"],
      exclude: ["packages/istanbul-lib-report/src/reports/**"],
      reporter: ["json"],
    },
    reporters: ["default", "./scripts/local-html-coverage-reporter.ts"],
    projects: ["packages/*"],
  },
});
