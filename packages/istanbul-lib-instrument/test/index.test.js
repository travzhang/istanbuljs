import { assert, describe, it, expect } from "vitest";

const index = require("../src/index");

describe("external interface", () => {
  it("exposes the correct objects", () => {
    const i = index.createInstrumenter();
    assert(i);
    assert(i.instrumentSync);
    assert(i.instrument);
    const pc = index.programVisitor;
    assert(pc);
    expect(pc).toBeTypeOf("function");
  });
});

describe("instrumenter", () => {
  it("should remove comments when asked to", function () {
    const instrumenter = index.createInstrumenter({
      preserveComments: false,
    });
    const instrumentedCode = instrumenter.instrumentSync(
      "/*foo*/\n//bar\ncode = true",
      "somefile.js",
    );
    assert.equal(instrumentedCode.indexOf("foo"), -1, "block comment not removed");
    assert.equal(instrumentedCode.indexOf("bar"), -1, "line comment not removed");
  });
});
