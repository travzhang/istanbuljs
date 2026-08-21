// TODO: switch to class private field when targeting node.js 12
const _summarizer = Symbol("ReportBase.#summarizer");

class ReportBase {
  constructor(opts = {}) {
    this[_summarizer] = opts.summarizer;
  }

  execute(context) {
    context.getTree(this[_summarizer]).visit(this, context);
  }
}

export default ReportBase;
