/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import ReportBase from "../../report-base";
import HtmlReport from "../html/index";
import LcovOnlyReport from "../lcovonly/index";
import type { LcovOnlyOptions } from "../lcovonly/index";

/** options accepted by {@link LcovReport}, passed through to the lcovonly report */
export interface LcovOptions extends LcovOnlyOptions {}

class LcovReport extends ReportBase {
  declare lcov: LcovOnlyReport;
  declare html: HtmlReport;

  constructor(opts?: LcovOptions) {
    super();
    this.lcov = new LcovOnlyReport({ file: "lcov.info", ...opts });
    this.html = new HtmlReport({ subdir: "lcov-report" });
  }
}

["Start", "End", "Summary", "SummaryEnd", "Detail"].forEach((what) => {
  const meth = "on" + what;
  (LcovReport.prototype as unknown as Record<string, unknown>)[meth] = function (
    this: LcovReport,
    ...args: unknown[]
  ) {
    const lcov = this.lcov as unknown as Record<string, undefined | ((...a: unknown[]) => void)>;
    const html = this.html as unknown as Record<string, undefined | ((...a: unknown[]) => void)>;

    if (lcov[meth]) {
      lcov[meth](...args);
    }
    if (html[meth]) {
      html[meth](...args);
    }
  };
});

export default LcovReport;
