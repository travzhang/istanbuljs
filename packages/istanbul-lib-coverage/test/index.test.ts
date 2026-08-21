import { describe, it, expect, assert } from "vitest";

import { CoverageMap } from "../src/coverage-map";
import { CoverageSummary } from "../src/coverage-summary";
import * as index from "../src/index";

describe("external interface", () => {
  it("exports the FileCoverage constructor", () => {
    expect(index.classes.FileCoverage).toBeTypeOf("function");
  });
  it("allows coverage summary creation", () => {
    const fc = index.createCoverageSummary();
    expect(fc).instanceOf(CoverageSummary);

    const fc2 = index.createCoverageSummary(fc);
    expect(fc2).toBe(fc);
  });
  it("allows coverage map creation", () => {
    const fc = index.createCoverageMap();
    expect(fc).instanceOf(CoverageMap);

    const fc2 = index.createCoverageMap(fc);
    expect(fc2).toBe(fc);
  });
  it("allows file coverage creation", () => {
    const fc = index.createFileCoverage("/path/to/foo.js");
    expect(fc).instanceOf(index.classes.FileCoverage);

    const fc2 = index.createFileCoverage(fc);
    expect(fc2).toBe(fc);
  });
});
