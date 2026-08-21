import { CoverageMap } from "./coverage-map";
import type { CoverageMapData } from "./coverage-map";
import { CoverageSummary } from "./coverage-summary";
import type { CoverageSummaryData } from "./coverage-summary";
/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/**
 * istanbul-lib-coverage exports an API that allows you to create and manipulate
 * file coverage, coverage maps (a set of file coverage objects) and summary
 * coverage objects. File coverage for the same file can be merged as can
 * entire coverage maps.
 *
 * @module Exports
 */
import { FileCoverage } from "./file-coverage";
import type { FileCoverageData } from "./file-coverage";

export type { CoverageMap } from "./coverage-map";
export type { CoverageMapData } from "./coverage-map";
export type { CoverageSummary } from "./coverage-summary";
export type { CoverageSummaryData, Totals } from "./coverage-summary";
export type { FileCoverage } from "./file-coverage";
export type {
  BranchMapping,
  Coverage,
  FileCoverageData,
  FunctionMapping,
  Location,
  Range,
} from "./file-coverage";

/**
 * creates a coverage summary object
 * @param obj an argument with the same semantics
 *  as the one passed to the `CoverageSummary` constructor
 */
export function createCoverageSummary(
  obj?: CoverageSummary | CoverageSummaryData,
): CoverageSummary {
  if (obj && obj instanceof CoverageSummary) {
    return obj;
  }
  return new CoverageSummary(obj);
}

/**
 * creates a CoverageMap object
 * @param obj optional - an argument with the same semantics
 *  as the one passed to the CoverageMap constructor.
 */
export function createCoverageMap(obj?: CoverageMap | CoverageMapData): CoverageMap {
  if (obj && obj instanceof CoverageMap) {
    return obj;
  }
  return new CoverageMap(obj);
}

/**
 * creates a FileCoverage object
 * @param obj optional - an argument with the same semantics
 *  as the one passed to the FileCoverage constructor.
 */
export function createFileCoverage(obj: string | FileCoverage | FileCoverageData): FileCoverage {
  if (obj && obj instanceof FileCoverage) {
    return obj;
  }
  return new FileCoverage(obj);
}

/** classes exported for reuse */
export const classes = {
  /**
   * the file coverage constructor
   */
  FileCoverage,
};
