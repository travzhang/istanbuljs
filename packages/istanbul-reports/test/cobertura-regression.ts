import * as istanbulLibCoverage from "@vitest/istanbul-lib-coverage";
import * as istanbulLibReport from "@vitest/istanbul-lib-report";
import { FileWriter } from "@vitest/istanbul-lib-report";
import { it } from "vitest";

import Report from "../src/cobertura/index";

it("issue 384", () => {
  const context = istanbulLibReport.createContext({
    dir: "./",
    coverageMap: istanbulLibCoverage.createCoverageMap({}),
  });
  const tree = context.getTree("pkg");
  const report = new Report({ file: "-" });

  FileWriter.startCapture();
  tree.visit(report, context);
  FileWriter.stopCapture();
});
