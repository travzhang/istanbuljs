/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import LcovOnly from "../lcovonly/index";

/** options accepted by {@link TextLcov}, `file` is always the console */
export interface TextLcovOptions {
  /** the project root used to relativize file paths, defaults to `process.cwd()` */
  projectRoot?: string;
}

class TextLcov extends LcovOnly {
  constructor(opts?: TextLcovOptions) {
    super({
      ...opts,
      file: "-",
    });
  }
}

export default TextLcov;
