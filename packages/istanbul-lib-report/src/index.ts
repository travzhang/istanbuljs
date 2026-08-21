/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/**
 * @module Exports
 */

import Context from "./context";
import type { ContextOptions } from "./context";
import FileWriter from "./file-writer";
import ReportBase from "./report-base";
import * as watermarks from "./watermarks";
import type { Watermarks } from "./watermarks";

export type { ContextOptions, SourceFinder } from "./context";
export type { Context };
export type { ContentWriter, ConsoleWriter, FileContentWriter } from "./file-writer";
export type { ReportBaseOptions } from "./report-base";
export type { ReportNode, ReportTree, Summarizers } from "./summarizer-factory";
export type { BaseNode, BaseTree, CompositeVisitor, PartialVisitor, Visitor } from "./tree";
export type { Watermark, Watermarks } from "./watermarks";
export type { XmlAttributes, default as XMLWriter } from "./xml-writer";

/**
 * returns a reporting context for the supplied options
 * @param {Object} [opts=null] opts
 * @returns {Context}
 */
export function createContext(opts: ContextOptions): Context {
  return new Context(opts);
}

/**
 * returns the default watermarks that would be used when not
 * overridden
 * @returns {Object} an object with `statements`, `functions`, `branches`,
 *  and `line` keys. Each value is a 2 element array that has the low and
 *  high watermark as percentages.
 */
export function getDefaultWatermarks(): Watermarks {
  return watermarks.getDefault();
}

/**
 * Base class for all reports
 */
export { ReportBase };

/**
 * Utility for writing files under a specific directory
 */
export { FileWriter };
