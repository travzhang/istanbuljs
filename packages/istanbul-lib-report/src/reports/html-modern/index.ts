/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import type { FileCoverageData } from "@vitest/istanbul-lib-coverage";

import type { Context, ReportBaseOptions, ReportNode, Summarizers } from "../../index";
import ReportBase from "../../report-base";
import { CoverageReport } from "./coverage-report";
import { extractIstanbulContext } from "./istanbul-context";
import type { HtmlModernOptions } from "./options";

export type { LinkMapper } from "../html/index";
export type { HtmlModernOptions } from "./options";
export type {
  CoverageData,
  CovData,
  GenerateOptions,
  GenerateResult,
  IstanbulReportContext,
  ReportData,
  ReportStats,
  SerializableHtmlModernOptions,
} from "./types";
export { CoverageReport } from "./coverage-report";
export { extractIstanbulContext } from "./istanbul-context";
export { inferProjectRoot, resolveProjectRoot } from "./infer-project-root";

class HtmlModernReport extends ReportBase {
  private options: HtmlModernOptions;
  private coverage: Record<string, FileCoverageData> = {};
  private summarizer?: Summarizers;

  constructor(opts: HtmlModernOptions & Partial<ReportBaseOptions> = {}) {
    super(opts);
    this.options = opts;
    this.coverage = {};
    if (opts.summarizer !== undefined) {
      this.summarizer = opts.summarizer;
    }
  }

  onDetail(node: ReportNode): void {
    const fileCoverage: FileCoverageData = JSON.parse(
      JSON.stringify(node.getFileCoverage().toJSON()),
    );
    this.coverage[fileCoverage.path] = fileCoverage;
  }

  async onEnd(_rootNode: ReportNode, context: Context): Promise<void> {
    const cr = new CoverageReport(this.options);
    await cr.generate({
      coverage: this.coverage,
      targetDir: context.dir,
      sourceFinder: context.sourceFinder,
      istanbul: extractIstanbulContext(context, this.summarizer),
    });
  }
}

export default HtmlModernReport;
