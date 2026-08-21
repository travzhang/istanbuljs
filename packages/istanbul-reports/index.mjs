/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import { createRequire } from "node:module";

import CloverReport from "./lib/clover/index.mjs";
import CoberturaReport from "./lib/cobertura/index.mjs";
import HtmlSpaReport from "./lib/html-spa/index.mjs";
import HtmlReport from "./lib/html/index.mjs";
import JsonSummaryReport from "./lib/json-summary/index.mjs";
import JsonReport from "./lib/json/index.mjs";
import LcovReport from "./lib/lcov/index.mjs";
import LcovOnlyReport from "./lib/lcovonly/index.mjs";
import NoneReport from "./lib/none/index.mjs";
import TeamcityReport from "./lib/teamcity/index.mjs";
import TextLcovReport from "./lib/text-lcov/index.mjs";
import TextSummaryReport from "./lib/text-summary/index.mjs";
import TextReport from "./lib/text/index.mjs";

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

export function create(name, cfg) {
  cfg = cfg || {};
  let Cons = reports[name];

  if (!Cons) {
    // Custom reporters are loaded from the file system, e.g. third-party packages
    Cons = createRequire(import.meta.url)(name);
  }

  return new Cons(cfg);
}
