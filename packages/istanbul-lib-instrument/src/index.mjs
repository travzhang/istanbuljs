import { defaults } from "@istanbuljs/schema";

import Instrumenter from "./instrumenter.mjs";
import readInitialCoverage from "./read-coverage.mjs";
import programVisitor from "./visitor.mjs";

/**
 * createInstrumenter creates a new instrumenter with the
 * supplied options.
 * @param {Object} opts - instrumenter options. See the documentation
 * for the Instrumenter class.
 */
function createInstrumenter(opts) {
  return new Instrumenter(opts);
}

const defaultOpts = defaults.instrumenter;

export { createInstrumenter, programVisitor, readInitialCoverage, defaultOpts };
