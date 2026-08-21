/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import { MapStore } from "./map-store";
import type { MapStoreOptions } from "./map-store";

export type {
  FileCoverageDataWithSourceMap,
  MapStore,
  MapStoreOptions,
  SourceStore,
} from "./map-store";
export type { Mapping } from "./get-mapping";
export type { MappedCoverage } from "./mapped";
export type {
  GetMapping,
  SourceMapFinder,
  SourceMapTransformer,
  SourceMapTransformerOptions,
} from "./transformer";

/**
 * @module Exports
 */
export function createSourceMapStore(opts?: MapStoreOptions): MapStore {
  return new MapStore(opts);
}
