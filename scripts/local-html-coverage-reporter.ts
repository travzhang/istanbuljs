import { createCoverageMap } from "../packages/istanbul-lib-coverage/src";
import type { CoverageMapData } from "../packages/istanbul-lib-coverage/src";
import { create, createContext } from "../packages/istanbul-lib-report/src";
import type { Reporter } from "vitest/node";

function toCoverageMapData(coverage: unknown): CoverageMapData {
  if (
    coverage &&
    typeof coverage === "object" &&
    "toJSON" in coverage &&
    typeof coverage.toJSON === "function"
  ) {
    return coverage.toJSON() as CoverageMapData;
  }
  return coverage as CoverageMapData;
}

export default class LocalHtmlCoverageReporter implements Reporter {
  onCoverage(coverage: unknown): void {
    const context = createContext({
      dir: "coverage",
      coverageMap: createCoverageMap(toCoverageMapData(coverage)),
    });
    create("html").execute(context);
  }
}
