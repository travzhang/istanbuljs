import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

import { REPORT_DATA_PLACEHOLDER } from "./report-data-placeholder.js";

const packageRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(packageRoot, "../..");
const mockPath = join(repoRoot, "coverage/report-data.json");

function readDevReportData(): string {
  if (!fs.existsSync(mockPath)) {
    return "null";
  }

  const reportData = JSON.parse(fs.readFileSync(mockPath, "utf-8")) as unknown;
  return JSON.stringify(reportData);
}

/** Injects mock coverage data from the repo-root coverage/report-data.json during dev. */
export function reportDataDevPlugin(): Plugin {
  return {
    name: "report-data-dev",
    apply: "serve",
    transformIndexHtml(html) {
      return html.replace(REPORT_DATA_PLACEHOLDER, readDevReportData());
    },
  };
}
