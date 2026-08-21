import { describe, it, expect } from "vitest";

import percent from "../lib/percent.mjs";

describe("percent calculation", () => {
  it("calculates percentage covered and total", () => {
    const p = percent(1, 1);

    expect(p).toBe(100);
  });
  it("calculates percentage with enough precision to detect minor differences with large covered and total", () => {
    const p = percent(999998, 999999);

    expect(p).lessThan(100);
  });
});
