/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import type { CoverageSummary } from "@vitest/istanbul-lib-coverage";
import type {
  ContentWriter,
  Context,
  ReportNode,
  XmlAttributes,
  XMLWriter,
} from "@vitest/istanbul-lib-report";
import { ReportBase } from "@vitest/istanbul-lib-report";

/** options accepted by {@link CloverReport} */
export interface CloverOptions {
  /** the file to write the report to, defaults to `clover.xml` */
  file?: string;
}

/** counts collected while walking the tree for the root `metrics` element */
interface TreeStats {
  packages: number;
  files: number;
  classes: number;
}

class CloverReport extends ReportBase {
  declare cw: ContentWriter | null;
  declare xml: XMLWriter | null;
  declare file: string;

  constructor(opts: CloverOptions) {
    super();

    this.cw = null;
    this.xml = null;
    this.file = opts.file || "clover.xml";
  }

  onStart(root: ReportNode, context: Context): void {
    this.cw = context.writer.writeFile(this.file);
    this.xml = context.getXMLWriter(this.cw);
    this.writeRootStats(root, context);
  }

  onEnd(): void {
    this.xml!.closeAll();
    this.cw!.close();
  }

  getTreeStats(node: ReportNode, context: Context): TreeStats {
    const state: TreeStats = {
      packages: 0,
      files: 0,
      classes: 0,
    };
    const visitor = {
      onSummary(node: ReportNode, state: TreeStats) {
        const metrics = node.getCoverageSummary(true);
        if (metrics) {
          state.packages += 1;
        }
      },
      onDetail(node: ReportNode, state: TreeStats) {
        state.classes += 1;
        state.files += 1;
      },
    };
    node.visit(context.getVisitor(visitor), state);
    return state;
  }

  writeRootStats(node: ReportNode, context: Context): void {
    this.cw!.println('<?xml version="1.0" encoding="UTF-8"?>');
    this.xml!.openTag("coverage", {
      generated: Date.now().toString(),
      clover: "3.2.0",
    });

    this.xml!.openTag("project", {
      timestamp: Date.now().toString(),
      name: "All files",
    });

    const metrics = node.getCoverageSummary()!;
    this.xml!.inlineTag("metrics", {
      statements: metrics.lines.total,
      coveredstatements: metrics.lines.covered,
      conditionals: metrics.branches.total,
      coveredconditionals: metrics.branches.covered,
      methods: metrics.functions.total,
      coveredmethods: metrics.functions.covered,
      elements: metrics.lines.total + metrics.branches.total + metrics.functions.total,
      coveredelements: metrics.lines.covered + metrics.branches.covered + metrics.functions.covered,
      complexity: 0,
      loc: metrics.lines.total,
      ncloc: metrics.lines.total, // what? copied as-is from old report
      ...this.getTreeStats(node, context),
    });
  }

  writeMetrics(metrics: CoverageSummary): void {
    this.xml!.inlineTag("metrics", {
      statements: metrics.lines.total,
      coveredstatements: metrics.lines.covered,
      conditionals: metrics.branches.total,
      coveredconditionals: metrics.branches.covered,
      methods: metrics.functions.total,
      coveredmethods: metrics.functions.covered,
    });
  }

  onSummary(node: ReportNode): void {
    if (node.isRoot()) {
      return;
    }
    const metrics = node.getCoverageSummary(true);
    if (!metrics) {
      return;
    }

    this.xml!.openTag("package", {
      name: asJavaPackage(node),
    });
    this.writeMetrics(metrics);
  }

  onSummaryEnd(node: ReportNode): void {
    if (node.isRoot()) {
      return;
    }
    this.xml!.closeTag(this.xml!.stack[this.xml!.stack.length - 1]);
  }

  onDetail(node: ReportNode): void {
    const fileCoverage = node.getFileCoverage();
    const metrics = node.getCoverageSummary()!;
    const branchByLine = fileCoverage.getBranchCoverageByLine();

    this.xml!.openTag("file", {
      name: asClassName(node),
      path: fileCoverage.path,
    });

    this.writeMetrics(metrics);

    const lines = fileCoverage.getLineCoverage();
    Object.entries(lines).forEach(([k, count]) => {
      const attrs: XmlAttributes = {
        num: k,
        count,
        type: "stmt",
      };
      const branchDetail = branchByLine[k];

      if (branchDetail) {
        attrs.type = "cond";
        attrs.truecount = branchDetail.covered;
        attrs.falsecount = branchDetail.total - branchDetail.covered;
      }
      this.xml!.inlineTag("line", attrs);
    });

    this.xml!.closeTag("file");
  }
}

function asJavaPackage(node: ReportNode): string {
  return node.getRelativeName().replace(/\//g, ".").replace(/\\/g, ".").replace(/\.$/, "");
}

function asClassName(node: ReportNode): string {
  return node.getRelativeName().replace(/.*[\\/]/, "");
}

export default CloverReport;
