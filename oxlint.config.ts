import { defineConfig } from "oxlint";

export default defineConfig({
  rules: {
    // TODO: Remove these and fix source code
    "no-unused-vars": "off",
    "unicorn/no-new-array": "off",
  },

  overrides: [
    {
      files: ["**/test/**"],
      rules: {
        "no-eval": "off",
      },
    },
  ],
});
