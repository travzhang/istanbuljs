/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import path from "node:path";

import type { ContentWriter, Context, ReportNode } from "../../index";
import ReportBase from "../../report-base";

/** options accepted by {@link LcovOnlyReport} */
export interface LcovOnlyOptions {
  /** the file to write the report to, defaults to `lcov.info` */
  file?: string;
  /** the project root used to relativize file paths, defaults to `process.cwd()` */
  projectRoot?: string;
}

class LcovOnlyReport extends ReportBase {
  declare file: string;
  declare projectRoot: string;
  declare contentWriter: ContentWriter | null;

  constructor(opts?: LcovOnlyOptions) {
    super();
    opts = opts || {};
    this.file = opts.file || "lcov.info";
    this.projectRoot = opts.projectRoot || process.cwd();
    this.contentWriter = null;
  }

  onStart(root: ReportNode, context: Context): void {
    this.contentWriter = context.writer.writeFile(this.file);
  }

  onDetail(node: ReportNode): void {
    const fc = node.getFileCoverage();
    const writer = this.contentWriter!;
    const functions = fc.f;
    const functionMap = fc.fnMap;
    const lines = fc.getLineCoverage();
    const branches = fc.b;
    const branchMap = fc.branchMap;
    const summary = node.getCoverageSummary()!;

    writer.println("TN:");
    const fileName = path.relative(this.projectRoot, fc.path);
    writer.println("SF:" + fileName);

    Object.values(functionMap).forEach((meta) => {
      // Some versions of the instrumenter in the wild populate 'loc'
      // but not 'decl':
      const decl = meta.decl || meta.loc;
      writer.println("FN:" + [decl.start.line, meta.name].join(","));
    });
    writer.println("FNF:" + summary.functions.total);
    writer.println("FNH:" + summary.functions.covered);

    Object.entries(functionMap).forEach(([key, meta]) => {
      const stats = functions[key];
      writer.println("FNDA:" + [stats, meta.name].join(","));
    });

    Object.entries(lines).forEach((entry) => {
      writer.println("DA:" + entry.join(","));
    });
    writer.println("LF:" + summary.lines.total);
    writer.println("LH:" + summary.lines.covered);

    Object.entries(branches).forEach(([key, branchArray]) => {
      const meta = branchMap[key];
      if (meta) {
        const { line } = meta.loc.start;
        branchArray.forEach((b, i) => {
          writer.println("BRDA:" + [line, key, i, b].join(","));
        });
      } else {
        console.warn("Missing coverage entries in", fileName, key);
      }
    });
    writer.println("BRF:" + summary.branches.total);
    writer.println("BRH:" + summary.branches.covered);
    writer.println("end_of_record");
  }

  onEnd(): void {
    this.contentWriter!.close();
  }
}

export default LcovOnlyReport;
