/*
 Copyright 2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import { classes } from "@vitest/istanbul-lib-coverage";
import type {
  BranchMapping,
  FileCoverage,
  FileCoverageData,
  FunctionMapping,
  Range,
} from "@vitest/istanbul-lib-coverage";

const { FileCoverage: FileCoverageCls } = classes;

/** bookkeeping metadata used to resolve duplicate mappings */
interface MappedCoverageMeta {
  last: {
    s: number;
    f: number;
    b: number;
  };
  seen: Record<string, number>;
}

function locString(loc: Range): string {
  return [loc.start.line, loc.start.column, loc.end.line, loc.end.column].join(":");
}

export class MappedCoverage extends FileCoverageCls {
  meta: MappedCoverageMeta;

  constructor(pathOrObj: string | FileCoverage | FileCoverageData) {
    super(pathOrObj);

    this.meta = {
      last: {
        s: 0,
        f: 0,
        b: 0,
      },
      seen: {},
    };
  }

  addStatement(loc: Range, hits: number): number {
    const key = "s:" + locString(loc);
    const { meta } = this;
    let index = meta.seen[key];

    if (index === undefined) {
      index = meta.last.s;
      meta.last.s += 1;
      meta.seen[key] = index;
      this.statementMap[index] = this.cloneLocation(loc);
    }

    this.s[index] = this.s[index] || 0;
    this.s[index] += hits;
    return index;
  }

  addFunction(name: string | undefined, decl: Range, loc: Range, hits: number): number {
    const key = "f:" + locString(decl);
    const { meta } = this;
    let index = meta.seen[key];

    if (index === undefined) {
      index = meta.last.f;
      meta.last.f += 1;
      meta.seen[key] = index;
      name = name || `(unknown_${index})`;
      this.fnMap[index] = {
        name,
        decl: this.cloneLocation(decl),
        loc: this.cloneLocation(loc),
      } as FunctionMapping;
    }

    this.f[index] = this.f[index] || 0;
    this.f[index] += hits;
    return index;
  }

  addBranch(type: string, loc: Range, branchLocations: Range[], hits: number[]): number {
    const key = ["b", ...branchLocations.map((l) => locString(l))].join(":");
    const { meta } = this;
    let index = meta.seen[key];
    if (index === undefined) {
      index = meta.last.b;
      meta.last.b += 1;
      meta.seen[key] = index;
      this.branchMap[index] = {
        loc,
        type,
        locations: branchLocations.map((l) => this.cloneLocation(l)),
      } as BranchMapping;
    }

    if (!this.b[index]) {
      this.b[index] = branchLocations.map(() => 0);
    }

    hits.forEach((hit, i) => {
      this.b[index][i] += hit;
    });
    return index;
  }

  /* Returns a clone of the location object with only the attributes of interest */
  cloneLocation(loc: Range): Range {
    return {
      start: {
        line: loc.start.line,
        column: loc.start.column,
      },
      end: {
        line: loc.end.line,
        column: loc.end.column,
      },
    };
  }
}
