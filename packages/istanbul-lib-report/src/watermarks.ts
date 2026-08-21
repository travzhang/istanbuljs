/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/**
 * A 2 element array that has the low and high watermark as percentages.
 */
export type Watermark = [number, number];

/**
 * Watermarks for the four coverage metrics. Each value is a 2 element array
 * that has the low and high watermark as percentages.
 */
export interface Watermarks {
  statements: Watermark;
  functions: Watermark;
  branches: Watermark;
  lines: Watermark;
}

export function getDefault(): Watermarks {
  return {
    statements: [50, 80],
    functions: [50, 80],
    branches: [50, 80],
    lines: [50, 80],
  };
}
