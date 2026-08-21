import { describe, it, assert } from "vitest";

import * as index from "../index.mjs";

describe("exports", () => {
  it("exports the correct interface", () => {
    assert.isFunction(index.createSourceMapStore);
  });
});
