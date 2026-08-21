import { createCoverageMap } from "@vitest/istanbul-lib-coverage";
import type { CoverageMap, CoverageMapData, FileCoverageData } from "@vitest/istanbul-lib-coverage";

function makeCoverage(
  filePath: string,
  numStatements: number,
  numCovered: number,
): FileCoverageData {
  const fc: FileCoverageData = {
    path: filePath,
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
  };
  let i;
  let index;

  for (i = 0; i < numStatements; i += 1) {
    index = i + 1;
    fc.statementMap[index] = {
      start: { line: i + 1, column: 0 },
      end: { line: i + 1, column: 100 },
    };
    if (i < numCovered) {
      fc.s[index] = 1;
    }
  }
  return fc;
}

function filesMap(dir: string | undefined, files: string[]): CoverageMap {
  if (!dir) {
    dir = "";
  } else if (dir !== "/") {
    dir = dir + "/";
  }

  let count = 0;

  return createCoverageMap(
    files.reduce((map: CoverageMapData, file) => {
      const filePath = dir + file;
      map[filePath] = makeCoverage(filePath, 4, count);
      count += 1;

      return map;
    }, {}),
  );
}

function protoDir(dir?: string): CoverageMap {
  return filesMap(dir, ["constructor.js", "toString.js"]);
}

function singleDir(dir?: string): CoverageMap {
  return filesMap(dir, ["file3.js", "file4.js", "file2.js", "file1.js"]);
}

function twoDir(nested?: boolean): CoverageMap {
  return filesMap("", [
    "lib1/file3.js",
    nested ? "lib1/lib2/file4.js" : "lib2/file4.js",
    "lib1/file2.js",
    nested ? "lib1/lib2/file1.js" : "lib2/file1.js",
  ]);
}

function threeDir(): CoverageMap {
  return filesMap("", ["lib1/file3.js", "lib2/file4.js", "lib1/sub/dir/file2.js", "file1.js"]);
}

function multiDir(): CoverageMap {
  return filesMap("", [
    "lib1/sub/file3.js",
    "lib1/file4.js",
    "lib2/sub1/file2.js",
    "lib2/sub2/file1.js",
  ]);
}

export const empty = createCoverageMap({});
export { protoDir, singleDir, twoDir, threeDir, multiDir };
