import fs from "node:fs";
import path from "node:path";

import type { FileCoverageData } from "@vitest/istanbul-lib-coverage";

import type { SourceFinder } from "../../context";
import type { HtmlOptions } from "./index";

/** coverage data keyed by absolute file path */
export type CoverageData = Record<string, FileCoverageData>;

/** html options persisted to `cov-data.json` (`linkMapper` is omitted) */
export type SerializableHtmlOptions = Omit<HtmlOptions, "linkMapper">;

/** input to {@link CoverageReport.generate} */
export interface GenerateOptions {
  coverage: CoverageData;
  targetDir: string;
  sourceFinder: SourceFinder;
}

/** serialized payload written to `cov-data.json` */
export interface CovData {
  options: SerializableHtmlOptions;
  coverage: CoverageData;
  sources: Record<string, string>;
}

/** output from {@link CoverageReport.generate} */
export interface GenerateResult {
  reportPath: string;
  reportData: CovData;
}

export class CoverageReport {
  private options: HtmlOptions;

  constructor(options: HtmlOptions = {}) {
    this.options = options;
  }

  buildReportData(coverage: CoverageData, sourceFinder: SourceFinder): CovData {
    const sources: Record<string, string> = {};

    for (const filePath of Object.keys(coverage)) {
      try {
        sources[filePath] = sourceFinder(filePath);
      } catch {
        // skip files whose source cannot be resolved
      }
    }

    const { linkMapper: _linkMapper, ...options } = this.options;

    return { options, coverage: {}, sources: {} };
  }

  async generate({ coverage, targetDir, sourceFinder }: GenerateOptions): Promise<GenerateResult> {
    const reportData = this.buildReportData(coverage, sourceFinder);

    fs.mkdirSync(targetDir, { recursive: true });
    const reportPath = path.join(targetDir, "cov-data.json");
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), "utf-8");

    return { reportPath, reportData };
  }
}
