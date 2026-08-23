/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import type { CoverageSummary } from "@vitest/istanbul-lib-coverage";

import type { Context, ReportNode } from "../../index";
import ReportBase from "../../report-base";

/** the four coverage metrics printed in the summary */
type MetricKey = "statements" | "branches" | "functions" | "lines";

/** options accepted by {@link TextSummaryReport} */
export interface TextSummaryOptions {
  /** the file to write the report to, defaults to the console */
  file?: string | null;
}

class TextSummaryReport extends ReportBase {
  declare file: string | null;

  constructor(opts?: TextSummaryOptions) {
    super();

    opts = opts || {};
    this.file = opts.file || null;
  }

  onStart(node: ReportNode, context: Context): void {
    const summary = node.getCoverageSummary()!;
    const cw = context.writer.writeFile(this.file);
    const printLine = function (key: MetricKey) {
      const str = lineForKey(summary, key);
      const pct = summary[key].pct;
      const clazz = context.classForPercent(key, typeof pct === "number" ? pct : NaN);
      cw.println(cw.colorize(str, clazz));
    };

    cw.println("");
    cw.println("=============================== Coverage summary ===============================");
    printLine("statements");
    printLine("branches");
    printLine("functions");
    printLine("lines");
    cw.println("================================================================================");
    cw.close();
  }
}

function lineForKey(summary: CoverageSummary, key: MetricKey): string {
  const metrics = summary[key];

  let name: string = key.substring(0, 1).toUpperCase() + key.substring(1);
  if (name.length < 12) {
    name += "                   ".substring(0, 12 - name.length);
  }
  const result = [
    name,
    ":",
    `${metrics.pct}%`,
    "(",
    metrics.covered + "/" + metrics.total,
    ")",
  ].join(" ");
  const skipped = metrics.skipped;
  if (skipped > 0) {
    return result + ", " + skipped + " ignored";
  }
  return result;
}

export default TextSummaryReport;
