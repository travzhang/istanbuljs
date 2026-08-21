import { describe, it, expect, assert } from "vitest";

import { CoverageMap } from "../lib/coverage-map.mjs";
import { FileCoverage } from "../lib/file-coverage.mjs";

describe("coverage map", () => {
  it("allows a noop constructor", () => {
    expect(() => new CoverageMap()).not.toThrow();
  });
  it("allows a data object constructor", () => {
    expect(
      () =>
        new CoverageMap({
          "foo.js": new FileCoverage("foo.js").data,
          "bar.js": new FileCoverage("bar.js").data,
        }),
    ).not.toThrow();
  });
  it("allows another coverage map in constructor", () => {
    expect(
      () =>
        new CoverageMap(
          new CoverageMap({
            "foo.js": new FileCoverage("foo.js"),
            "bar.js": new FileCoverage("bar.js"),
          }),
        ),
    ).not.toThrow();
  });
  it("merges another coverage map into itself", () => {
    const cm1 = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "bar.js": new FileCoverage("bar.js"),
    });
    const cm2 = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "baz.js": new FileCoverage("baz.js"),
    });
    cm1.merge(cm2);
    expect(cm1.files()).toHaveLength(3);
    expect(cm1.files()).toEqual(["foo.js", "bar.js", "baz.js"]);
  });
  it("merges coverage map data into itself", () => {
    const cm1 = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "bar.js": new FileCoverage("bar.js"),
    });
    const cm2 = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "baz.js": new FileCoverage("baz.js"),
    }).toJSON();
    cm1.merge(cm2);
    expect(cm1.files()).toHaveLength(3);
    expect(cm1.files()).toEqual(["foo.js", "bar.js", "baz.js"]);
  });
  it("returns file coverage for file", () => {
    const cm = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "bar.js": new FileCoverage("bar.js"),
    });
    assert(cm.fileCoverageFor("foo.js"));
    assert(cm.fileCoverageFor("bar.js"));
    expect(() => cm.fileCoverageFor("baz.js")).toThrow();
  });
  it("allows addition of new file coverage", () => {
    const cm = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "bar.js": new FileCoverage("bar.js"),
    });
    cm.addFileCoverage(new FileCoverage("foo.js"));
    cm.addFileCoverage(new FileCoverage("baz.js"));
    expect(cm.files()).toHaveLength(3);
    expect(cm.files()).toEqual(["foo.js", "bar.js", "baz.js"]);
  });
  it("can filter file coverage", () => {
    const cm = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "bar.js": new FileCoverage("bar.js"),
    });
    expect(cm.files()).toEqual(["foo.js", "bar.js"]);
    cm.filter((file) => file === "foo.js");
    expect(cm.files()).toEqual(["foo.js"]);
  });
  it("returns coverage summary for all files", () => {
    const cm = new CoverageMap({
      "foo.js": new FileCoverage("foo.js"),
      "bar.js": new FileCoverage("bar.js"),
    });
    cm.addFileCoverage(new FileCoverage("foo.js"));
    cm.addFileCoverage(new FileCoverage("baz.js"));
    const summary = cm.getCoverageSummary();
    assert(summary.statements);
    expect(summary.statements.total).toBe(0);
  });
});
