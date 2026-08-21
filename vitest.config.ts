import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["packages/**/index.mjs", "packages/**/lib/**/*.mjs"],
      exclude: ["**/istanbul-reports/**"],
    },
    projects: ["packages/*"],
  },
});
