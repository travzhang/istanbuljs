import { describe, it, assert } from "vitest";

import type { ContentWriter } from "../src/file-writer";
import XMLWriter from "../src/xml-writer";

class MockContentWriter {
  str = "";

  write(s: string): void {
    this.str += s;
  }

  println(s: string): void {
    this.write(s + "\n");
  }
}

function createWriter(): { cw: MockContentWriter; xw: XMLWriter } {
  const cw = new MockContentWriter();
  const xw = new XMLWriter(cw as unknown as ContentWriter);
  return { cw, xw };
}

describe("xml writer", () => {
  it("creates an XML document correctly", () => {
    const { cw, xw } = createWriter();
    xw.openTag("foo");
    xw.inlineTag("bar", { baz: "y" }, "some text");
    xw.inlineTag("qux", {});
    xw.closeTag("foo");
    assert.equal(cw.str, '<foo>\n  <bar baz="y">some text</bar>\n  <qux/>\n</foo>\n');
  });

  it("auto-closes open tags correctly", () => {
    const { cw, xw } = createWriter();
    xw.openTag("foo");
    xw.inlineTag("bar", { baz: "y" }, "some text");
    xw.inlineTag("qux");
    xw.closeAll();
    assert.equal(cw.str, '<foo>\n  <bar baz="y">some text</bar>\n  <qux/>\n</foo>\n');
  });

  it("throws when closing a tag when none open", () => {
    const { xw } = createWriter();
    assert.throws(() => {
      xw.closeTag("foo");
    });
  });

  it("throws when closing a mismatched tag", () => {
    const { xw } = createWriter();
    xw.openTag("bar");
    assert.throws(() => {
      xw.closeTag("foo");
    });
  });
});
