/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import type { ContentWriter, Context, ReportNode } from "../../index";
import ReportBase from "../../report-base";

/** options accepted by {@link JsonReport} */
export interface JsonOptions {
  /** the file to write the report to, defaults to `coverage-final.json` */
  file?: string;
}

class JsonReport extends ReportBase {
  declare file: string;
  declare first: boolean;
  declare contentWriter: ContentWriter;

  constructor(opts: JsonOptions) {
    super();

    this.file = opts.file || "coverage-final.json";
    this.first = true;
  }

  onStart(root: ReportNode, context: Context): void {
    this.contentWriter = context.writer.writeFile(this.file);
    this.contentWriter.write("{");
  }

  onDetail(node: ReportNode): void {
    const fc = node.getFileCoverage();
    const key = fc.path;
    const cw = this.contentWriter;

    if (this.first) {
      this.first = false;
    } else {
      cw.write(",");
    }
    cw.write(JSON.stringify(key));
    cw.write(": ");
    cw.write(JSON.stringify(fc));
    cw.println("");
  }

  onEnd(): void {
    const cw = this.contentWriter;
    cw.println("}");
    cw.close();
  }
}

export default JsonReport;
