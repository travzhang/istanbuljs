/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import { createRequire } from "node:module";

import type { ReportBase } from "@vitest/istanbul-lib-report";

import CloverReport from "./clover/index";
import type { CloverOptions } from "./clover/index";
import CoberturaReport from "./cobertura/index";
import type { CoberturaOptions } from "./cobertura/index";
import HtmlSpaReport from "./html-spa/index";
import type { HtmlSpaOptions } from "./html-spa/index";
import HtmlReport from "./html/index";
import type { HtmlOptions } from "./html/index";
import JsonSummaryReport from "./json-summary/index";
import type { JsonSummaryOptions } from "./json-summary/index";
import JsonReport from "./json/index";
import type { JsonOptions } from "./json/index";
import LcovReport from "./lcov/index";
import type { LcovOptions } from "./lcov/index";
import LcovOnlyReport from "./lcovonly/index";
import type { LcovOnlyOptions } from "./lcovonly/index";
import NoneReport from "./none/index";
import TeamcityReport from "./teamcity/index";
import type { TeamcityOptions } from "./teamcity/index";
import TextLcovReport from "./text-lcov/index";
import type { TextLcovOptions } from "./text-lcov/index";
import TextSummaryReport from "./text-summary/index";
import type { TextSummaryOptions } from "./text-summary/index";
import TextReport from "./text/index";
import type { TextOptions } from "./text/index";

export type { CloverOptions } from "./clover/index";
export type { CoberturaOptions } from "./cobertura/index";
export type { HtmlSpaOptions } from "./html-spa/index";
export type { HtmlOptions, LinkMapper } from "./html/index";
export type { JsonSummaryOptions } from "./json-summary/index";
export type { JsonOptions } from "./json/index";
export type { LcovOptions } from "./lcov/index";
export type { LcovOnlyOptions } from "./lcovonly/index";
export type { TeamcityOptions } from "./teamcity/index";
export type { TextLcovOptions } from "./text-lcov/index";
export type { TextSummaryOptions } from "./text-summary/index";
export type { TextOptions } from "./text/index";

const reports = {
  clover: CloverReport,
  cobertura: CoberturaReport,
  html: HtmlReport,
  "html-spa": HtmlSpaReport,
  json: JsonReport,
  "json-summary": JsonSummaryReport,
  lcov: LcovReport,
  lcovonly: LcovOnlyReport,
  none: NoneReport,
  teamcity: TeamcityReport,
  text: TextReport,
  "text-lcov": TextLcovReport,
  "text-summary": TextSummaryReport,
};

/** options accepted by each built-in report, keyed by report name */
export interface ReportOptions {
  clover: CloverOptions;
  cobertura: CoberturaOptions;
  html: HtmlOptions;
  "html-spa": HtmlSpaOptions;
  json: JsonOptions;
  "json-summary": JsonSummaryOptions;
  lcov: LcovOptions;
  lcovonly: LcovOnlyOptions;
  none: never;
  teamcity: TeamcityOptions;
  text: TextOptions;
  "text-lcov": TextLcovOptions;
  "text-summary": TextSummaryOptions;
}

/** names of the built-in reports */
export type ReportType = keyof ReportOptions;

export function create<T extends ReportType>(
  name: T,
  cfg?: Partial<ReportOptions[T]>,
): InstanceType<(typeof reports)[T]>;
export function create(name: string, cfg?: object): ReportBase;
export function create(name: string, cfg?: object): ReportBase {
  cfg = cfg || {};
  let Cons = (reports as Record<string, unknown>)[name] as new (cfg: object) => ReportBase;

  if (!Cons) {
    // TODO Verify custom reporters load here fine
    Cons = createRequire(import.meta.url)(name);
  }

  return new Cons(cfg);
}
