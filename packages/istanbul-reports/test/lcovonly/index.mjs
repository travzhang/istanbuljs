import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import * as istanbulLibCoverage from "@vitest/istanbul-lib-coverage";
import * as istanbulLibReport from "@vitest/istanbul-lib-report";
import FileWriter from "@vitest/istanbul-lib-report/lib/file-writer.mjs";
import isWindows from "is-windows";
import { should } from "vitest";

import LcovOnlyReport from "../../lib/lcovonly/index.mjs";

const require = createRequire(import.meta.url);

should();

describe("LcovOnlyReport", () => {
  before(() => {
    FileWriter.startCapture();
  });
  after(() => {
    FileWriter.stopCapture();
  });
  beforeEach(() => {
    FileWriter.resetOutput();
  });

  function createTest(file) {
    const fixture = require(path.resolve(import.meta.dirname, "../fixtures/specs/" + file));
    it(fixture.title, function () {
      if (isWindows()) {
        // appveyor does not render console color.
        return this.skip();
      }
      const context = istanbulLibReport.createContext({
        dir: "./",
        coverageMap: istanbulLibCoverage.createCoverageMap(fixture.map),
      });
      const tree = context.getTree("pkg");
      const report = new LcovOnlyReport(fixture.opts);
      tree.visit(report, context);
      const output = FileWriter.getOutput().replace(/SF:.*/, "SF:");
      if (fixture.lcovonlyExpected) {
        output.should.equal(fixture.lcovonlyExpected);
      }
    });
  }

  fs.readdirSync(path.resolve(import.meta.dirname, "../fixtures/specs")).forEach((file) => {
    if (file.indexOf(".json") !== -1) {
      createTest(file);
    }
  });
});
