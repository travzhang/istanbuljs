import { defineProject } from "vitest/config";

import * as pkg from "./package.json";

export default defineProject({
  test: {
    name: { label: pkg.name, color: "yellow" },
  },
});
