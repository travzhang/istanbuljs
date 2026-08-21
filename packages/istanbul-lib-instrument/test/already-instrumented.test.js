import { it, expect } from "vitest";

const Instrumenter = require("../src/instrumenter");

function instrument(code, inputSourceMap) {
  const instrumenter = new Instrumenter({ compact: false });
  const result = instrumenter.instrumentSync(
    code,
    new URL(import.meta.url).pathname,
    inputSourceMap,
  );
  return {
    code: result,
    coverageData: instrumenter.lastFileCoverage(),
    sourceMap: instrumenter.lastSourceMap(),
  };
}

const instrumented = instrument(`console.log('basic test');`);

it("should not alter already instrumented code", () => {
  const result = instrument(instrumented.code, instrumented.sourceMap);
  [instrumented, result].forEach(({ sourceMap }) => {
    // XXX Ignore source-map difference caused by:
    // https://github.com/babel/babel/issues/10518
    delete sourceMap.mappings;
    delete sourceMap.names;
  });
  expect(instrumented).toEqual(result);
});
