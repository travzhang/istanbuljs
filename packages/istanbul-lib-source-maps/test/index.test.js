import { describe, it, assert } from "vitest";

const index = require("../index");

describe("exports", () => {
  it("exports the correct interface", () => {
    assert.isObject(index);
  });
});
