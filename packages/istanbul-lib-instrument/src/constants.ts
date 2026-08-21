import { createHash } from "node:crypto";

import pkg from "../package.json" with { type: "json" };
// TODO: increment this version if there are schema changes
// that are not backwards compatible:
const VERSION = "4";

export const SHA = "sha1";
export const MAGIC_KEY = "_coverageSchema";
export const MAGIC_VALUE = createHash(SHA)
  .update(pkg.name + "@" + VERSION)
  .digest("hex");
