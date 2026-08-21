import { describe, it, assert } from "vitest";

import * as index from "../src/index";

describe("exports", () => {
  it("exports the correct interface", () => {
    assert.isFunction(index.createSourceMapStore);
  });
});
