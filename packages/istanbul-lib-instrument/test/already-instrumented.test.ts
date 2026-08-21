import { it, expect } from "vitest";

import type { InputSourceMap } from "../src/index";
import Instrumenter from "../src/instrumenter";

function instrument(code: string, inputSourceMap?: InputSourceMap) {
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
  const result = instrument(instrumented.code, instrumented.sourceMap as InputSourceMap);
  [instrumented, result].forEach(({ sourceMap }: { sourceMap: any }) => {
    // XXX Ignore source-map difference caused by:
    // https://github.com/babel/babel/issues/10518
    delete sourceMap.mappings;
    delete sourceMap.names;
  });
  expect(instrumented).toEqual(result);
});
