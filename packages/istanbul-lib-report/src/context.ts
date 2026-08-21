/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import fs from "node:fs";

import type { CoverageMap } from "@vitest/istanbul-lib-coverage";

import FileWriter from "./file-writer";
import type { ContentWriter } from "./file-writer";
import SummarizerFactory from "./summarizer-factory";
import type { ReportNode, ReportTree, Summarizers } from "./summarizer-factory";
import * as tree from "./tree";
import type { PartialVisitor, Visitor } from "./tree";
import * as watermarks from "./watermarks";
import type { Watermark, Watermarks } from "./watermarks";
import XMLWriter from "./xml-writer";

/** a function that returns source code given a file path */
export type SourceFinder = (filePath: string) => string;

/** options accepted by {@link Context} / `createContext` */
export interface ContextOptions {
  /** the coverage map to report on */
  coverageMap: CoverageMap;
  /** the reporting directory, defaults to `coverage` */
  dir?: string;
  /** watermarks for statements, lines, branches and functions */
  watermarks?: Partial<Watermarks>;
  /** the default summarizer strategy, defaults to `pkg` */
  defaultSummarizer?: Summarizers;
  /**
   * a function that returns source code given a file path. Defaults to
   * filesystem lookups based on path.
   */
  sourceFinder?: SourceFinder;
}

function defaultSourceLookup(path: string): string {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (ex) {
    throw new Error(`Unable to lookup source: ${path} (${(ex as Error).message})`);
  }
}

function normalizeWatermarks(specified: Partial<Watermarks> = {}): Watermarks {
  Object.entries(watermarks.getDefault()).forEach(([k, value]) => {
    const key = k as keyof Watermarks;
    const specValue = specified[key];
    if (!Array.isArray(specValue) || specValue.length !== 2) {
      specified[key] = value;
    }
  });

  return specified as Watermarks;
}

/**
 * A reporting context that is passed to report implementations
 * @param {Object} [opts=null] opts options
 * @param {String} [opts.dir='coverage'] opts.dir the reporting directory
 * @param {Object} [opts.watermarks=null] opts.watermarks watermarks for
 *  statements, lines, branches and functions
 * @param {Function} [opts.sourceFinder=fsLookup] opts.sourceFinder a
 *  function that returns source code given a file path. Defaults to
 *  filesystem lookups based on path.
 * @constructor
 */
class Context {
  declare dir: string;
  declare watermarks: Watermarks;
  declare sourceFinder: SourceFinder;
  declare data: { writer?: FileWriter };
  declare private _summarizerFactory: SummarizerFactory;

  declare readonly writer: FileWriter;

  constructor(opts: ContextOptions) {
    this.dir = opts.dir || "coverage";
    this.watermarks = normalizeWatermarks(opts.watermarks);
    this.sourceFinder = opts.sourceFinder || defaultSourceLookup;
    this._summarizerFactory = new SummarizerFactory(opts.coverageMap, opts.defaultSummarizer);
    this.data = {};
  }

  /**
   * returns a FileWriter implementation for reporting use. Also available
   * as the `writer` property on the context.
   * @returns {Writer}
   */
  getWriter(): FileWriter {
    return this.writer;
  }

  /**
   * returns the source code for the specified file path or throws if
   * the source could not be found.
   * @param {String} filePath the file path as found in a file coverage object
   * @returns {String} the source code
   */
  getSource(filePath: string): string {
    return this.sourceFinder(filePath);
  }

  /**
   * returns the coverage class given a coverage
   * types and a percentage value.
   * @param {String} type - the coverage type, one of `statements`, `functions`,
   *  `branches`, or `lines`
   * @param {Number} value - the percentage value
   * @returns {String} one of `high`, `medium` or `low`
   */
  classForPercent(type: string, value: number): string {
    const watermarks = this.watermarks[type as keyof Watermarks] as Watermark | undefined;
    if (!watermarks) {
      return "unknown";
    }
    if (value < watermarks[0]) {
      return "low";
    }
    if (value >= watermarks[1]) {
      return "high";
    }
    return "medium";
  }

  /**
   * returns an XML writer for the supplied content writer
   * @param {ContentWriter} contentWriter the content writer to which the returned XML writer
   *  writes data
   * @returns {XMLWriter}
   */
  getXMLWriter(contentWriter: ContentWriter): XMLWriter {
    return new XMLWriter(contentWriter);
  }

  /**
   * returns a full visitor given a partial one.
   * @param {Object} partialVisitor a partial visitor only having the functions of
   *  interest to the caller. These functions are called with a scope that is the
   *  supplied object.
   * @returns {Visitor}
   */
  getVisitor(partialVisitor: PartialVisitor<ReportNode>): Visitor<ReportNode> {
    return new tree.Visitor(partialVisitor);
  }

  getTree(name: Summarizers = "defaultSummarizer"): ReportTree {
    return this._summarizerFactory[name];
  }
}

Object.defineProperty(Context.prototype, "writer", {
  enumerable: true,
  get(this: Context) {
    if (!this.data.writer) {
      this.data.writer = new FileWriter(this.dir);
    }
    return this.data.writer;
  },
});

export default Context;
