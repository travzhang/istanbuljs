/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import { MapStore } from "./lib/map-store.mjs";

/**
 * @module Exports
 */
export function createSourceMapStore(opts) {
  return new MapStore(opts);
}
