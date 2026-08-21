import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import * as istanbulLibCoverage from "@vitest/istanbul-lib-coverage";
import * as istanbulLibReport from "@vitest/istanbul-lib-report";
import { FileWriter } from "@vitest/istanbul-lib-report";
import isWindows from "is-windows";
import { afterAll as after, beforeAll as before, beforeEach, describe, it, should } from "vitest";

import CoberturaReport from "../../src/cobertura/index";

const require = createRequire(import.meta.url);

should();

describe("CoberturaReport", () => {
  before(() => {
    FileWriter.startCapture();
  });
  after(() => {
    FileWriter.stopCapture();
  });
  beforeEach(() => {
    FileWriter.resetOutput();
  });

  function createTest(file: string) {
    const fixture = require(path.resolve(import.meta.dirname, "../fixtures/specs/" + file));
    it(fixture.title, function (this: { skip(): void }) {
      if (isWindows()) {
        // appveyor does not render console color.
        return this.skip();
      }
      const context = istanbulLibReport.createContext({
        dir: "./",
        coverageMap: istanbulLibCoverage.createCoverageMap(fixture.map),
      });
      const tree = context.getTree("pkg");
      const report = new CoberturaReport({
        file: "-",
        timestamp: "123456789",
        ...fixture.opts,
      });
      tree.visit(report, context);
      const output = FileWriter.getOutput();
      (output as any).should.equal(fixture.coberturaCoverageData);
    });
  }

  fs.readdirSync(path.resolve(import.meta.dirname, "../fixtures/specs")).forEach((file) => {
    if (file.indexOf(".json") !== -1) {
      createTest(file);
    }
  });
});
