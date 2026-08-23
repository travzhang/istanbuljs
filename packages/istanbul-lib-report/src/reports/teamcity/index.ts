/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import type { Context, ReportNode } from "../../index";
import ReportBase from "../../report-base";

/** options accepted by {@link TeamcityReport} */
export interface TeamcityOptions {
  /** the file to write the report to, defaults to the console */
  file?: string | null;
  /** the teamcity block name to wrap the output in, defaults to `Code Coverage Summary` */
  blockName?: string;
}

class TeamcityReport extends ReportBase {
  declare file: string | null;
  declare blockName: string;

  constructor(opts?: TeamcityOptions) {
    super();

    opts = opts || {};
    this.file = opts.file || null;
    this.blockName = opts.blockName || "Code Coverage Summary";
  }

  onStart(node: ReportNode, context: Context): void {
    const metrics = node.getCoverageSummary()!;
    const cw = context.writer.writeFile(this.file);

    cw.println("");
    cw.println("##teamcity[blockOpened name='" + this.blockName + "']");

    //Statements Covered
    cw.println(lineForKey(metrics.statements.covered, "CodeCoverageAbsBCovered"));
    cw.println(lineForKey(metrics.statements.total, "CodeCoverageAbsBTotal"));

    //Branches Covered
    cw.println(lineForKey(metrics.branches.covered, "CodeCoverageAbsRCovered"));
    cw.println(lineForKey(metrics.branches.total, "CodeCoverageAbsRTotal"));

    //Functions Covered
    cw.println(lineForKey(metrics.functions.covered, "CodeCoverageAbsMCovered"));
    cw.println(lineForKey(metrics.functions.total, "CodeCoverageAbsMTotal"));

    //Lines Covered
    cw.println(lineForKey(metrics.lines.covered, "CodeCoverageAbsLCovered"));
    cw.println(lineForKey(metrics.lines.total, "CodeCoverageAbsLTotal"));

    cw.println("##teamcity[blockClosed name='" + this.blockName + "']");
    cw.close();
  }
}

function lineForKey(value: number, teamcityVar: string): string {
  return "##teamcity[buildStatisticValue key='" + teamcityVar + "' value='" + value + "']";
}

export default TeamcityReport;
