/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import path from "node:path";

export const isAbsolute = path.isAbsolute;

export function asAbsolute(file: string, baseDir?: string | null): string {
  return path.isAbsolute(file) ? file : path.resolve(baseDir || process.cwd(), file);
}

export function relativeTo(file: string, origFile: string): string {
  return path.isAbsolute(file) ? file : path.resolve(path.dirname(origFile), file);
}
