/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import type { CoverageSummary } from "@vitest/istanbul-lib-coverage";
import type { ContentWriter, Context, ReportNode } from "@vitest/istanbul-lib-report";
import { ReportBase } from "@vitest/istanbul-lib-report";

/** options accepted by {@link JsonSummaryReport} */
export interface JsonSummaryOptions {
  /** the file to write the report to, defaults to `coverage-summary.json` */
  file?: string;
}

class JsonSummaryReport extends ReportBase {
  declare file: string;
  declare contentWriter: ContentWriter | null;
  declare first: boolean;

  constructor(opts: JsonSummaryOptions) {
    super();

    this.file = opts.file || "coverage-summary.json";
    this.contentWriter = null;
    this.first = true;
  }

  onStart(root: ReportNode, context: Context): void {
    this.contentWriter = context.writer.writeFile(this.file);
    this.contentWriter.write("{");
  }

  writeSummary(filePath: string, sc: CoverageSummary | null): void {
    const cw = this.contentWriter!;
    if (this.first) {
      this.first = false;
    } else {
      cw.write(",");
    }
    cw.write(JSON.stringify(filePath));
    cw.write(": ");
    cw.write(JSON.stringify(sc));
    cw.println("");
  }

  onSummary(node: ReportNode): void {
    if (!node.isRoot()) {
      return;
    }
    this.writeSummary("total", node.getCoverageSummary());
  }

  onDetail(node: ReportNode): void {
    this.writeSummary(node.getFileCoverage().path, node.getCoverageSummary());
  }

  onEnd(): void {
    const cw = this.contentWriter!;
    cw.println("}");
    cw.close();
  }
}

export default JsonSummaryReport;
