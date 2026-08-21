import type Context from "./context";
import type { ReportNode, Summarizers } from "./summarizer-factory";
import type { PartialVisitor } from "./tree";

// TODO: switch to class private field when targeting node.js 12
const _summarizer: unique symbol = Symbol("ReportBase.#summarizer");

/** options accepted by {@link ReportBase} */
export interface ReportBaseOptions {
  /** the summarizer strategy to use when executing the report */
  summarizer?: Summarizers;
}

class ReportBase {
  declare private [_summarizer]: Summarizers | undefined;

  constructor(opts: ReportBaseOptions = {}) {
    this[_summarizer] = opts.summarizer;
  }

  execute(context: Context): void {
    context.getTree(this[_summarizer]).visit(this as PartialVisitor<ReportNode>, context);
  }
}

export default ReportBase;
