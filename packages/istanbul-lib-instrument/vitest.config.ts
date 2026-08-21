import { fileURLToPath } from "node:url";

import { defineProject } from "vitest/config";

import pkg from "./package.json" with { type: "json" };

export default defineProject({
  test: {
    name: { label: pkg.name, color: "red" },
  },
});
