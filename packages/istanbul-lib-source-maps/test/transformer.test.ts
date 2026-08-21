import path from "node:path";

import { TraceMap } from "@jridgewell/trace-mapping";
import type { EncodedSourceMap } from "@jridgewell/trace-mapping";
import { createCoverageMap as createMap } from "@vitest/istanbul-lib-coverage";
import type {
  FileCoverageData,
  FunctionMapping,
  Location,
  Range,
} from "@vitest/istanbul-lib-coverage";
import { describe, it, assert } from "vitest";

import type { Mapping } from "../src/get-mapping";
import { SourceMapTransformer } from "../src/transformer";
import functionWithoutClosingBraceCoverageData from "./testdata/functionWithoutClosingBraceCoverageData.json" with { type: "json" };
import ifWithImplicitElseCoverageData from "./testdata/ifWithImplicitElseCoverageData.json" with { type: "json" };
import implicitElseEdgeCase from "./testdata/implicitElseEdgeCase.json" with { type: "json" };
import switchBranchCoverageData from "./testdata/switchBranchCoverageData.json" with { type: "json" };
import switchBranchCoverageDataExpectedResult from "./testdata/switchBranchCoverageDataExpectedResult.json" with { type: "json" };
import switchBranchCoverageDataMapping from "./testdata/switchBranchCoverageDataMapping.json" with { type: "json" };

const coverageData = {
  statementMap: {
    0: {
      start: { line: 2, column: 0 },
      end: { line: 2, column: 29 },
    },
    1: {
      start: { line: 3, column: 0 },
      end: { line: 3, column: 47 },
    },
  },
  fnMap: {},
  branchMap: {},
  s: {
    0: 0,
    1: 0,
    2: 0,
  },
  f: {},
  b: {},
};

const sourceFileSlash = path.posix.normalize("/path/to/file.js");
const sourceFileBackslash = path.win32.normalize("/path/to/file.js");

const testDataSlash = {
  sourceMap: {
    version: 3,
    sources: [sourceFileSlash],
    mappings: ";AAAa,mBAAW,GAAG,MAAM,CAAC;AACrB,kBAAU,GAAG,yBAAyB,CAAC",
  } as unknown as EncodedSourceMap,
  coverageData: {
    ...coverageData,
    path: sourceFileSlash,
  },
};

const testDataBackslash = {
  coverageData: {
    ...coverageData,
    path: sourceFileBackslash,
  },
};

interface MappingEntry {
  start: Location;
  end: Location;
  mapped: Range;
}

class MappingResolver {
  mapping: MappingEntry[];

  constructor(mapping: MappingEntry[]) {
    this.mapping = mapping;
  }

  resolveMapping(sourceMap: TraceMap, location: Range, filePath: string): Mapping | null {
    const mapResult = this.mapping.find(
      (m) =>
        m.start.line == location.start.line &&
        m.start.column == location.start.column &&
        m.end.line == location.end.line &&
        m.end.column == location.end.column,
    );

    if (!mapResult) {
      return null;
    }

    return {
      source: filePath.replace(".js", ".ts"),
      loc: {
        start: mapResult.mapped.start,
        end: mapResult.mapped.end,
      },
    };
  }
}

describe("transformer", () => {
  it("maps statement locations", async () => {
    const coverageMap = createMap({});
    coverageMap.addFileCoverage(testDataSlash.coverageData);

    const transformer = new SourceMapTransformer(() => new TraceMap(testDataSlash.sourceMap));
    const mapped = await transformer.transform(coverageMap);

    assert.deepEqual(mapped.data[testDataSlash.coverageData.path].statementMap, {
      0: {
        start: { line: 1, column: 13 },
        end: { line: 1, column: 34 },
      },
      1: {
        start: { line: 2, column: 13 },
        end: { line: 2, column: 52 },
      },
    });
  });

  it("maps each file only once, /path/to/file.js and \\path\\to\\file.js are the same file", async () => {
    const coverageMap = createMap({});

    coverageMap.addFileCoverage(testDataSlash.coverageData);
    coverageMap.addFileCoverage(testDataBackslash.coverageData);

    const transformer = new SourceMapTransformer((file) =>
      file === testDataSlash.coverageData.path ? new TraceMap(testDataSlash.sourceMap) : undefined,
    );
    const mapped = await transformer.transform(coverageMap);

    assert.equal(Object.keys(mapped.data).length, 1);
    assert.isDefined(mapped.data[testDataBackslash.coverageData.path]);
  });

  it("correctly maps location for branch statements", async () => {
    const mappingResolver = new MappingResolver(
      switchBranchCoverageDataMapping as unknown as MappingEntry[],
    );

    const coverageMap = createMap({});
    coverageMap.addFileCoverage(switchBranchCoverageData as unknown as FileCoverageData);

    const transformer = new SourceMapTransformer((file) => ({ file }) as unknown as TraceMap, {
      getMapping: mappingResolver.resolveMapping.bind(mappingResolver),
    });
    const mapped = await transformer.transform(coverageMap);

    assert.deepEqual(
      mapped.fileCoverageFor("dummyFile.ts").data,
      switchBranchCoverageDataExpectedResult as unknown as FileCoverageData,
    );
  });

  it("correctly maps branch count of implicit else", async () => {
    const implicitElseCoverageData = ifWithImplicitElseCoverageData;
    const sourceMap = {
      version: 3,
      sources: [sourceFileSlash],
      mappings:
        "AACA,SAAS,IAAI,GAAW,GAAmB;AAGvC,UAAQ,IAAI,aAAa;AAEzB,MAAG,MAAM,IAAI;AACT,WAAO;AAAA,EACX;AACJ;AAEA,IAAI,GAAG,CAAC;",
    } as unknown as EncodedSourceMap;

    const coverageMap = createMap({});
    coverageMap.addFileCoverage(implicitElseCoverageData as unknown as FileCoverageData);

    const transformer = new SourceMapTransformer(() => new TraceMap(sourceMap));

    const mapped = await transformer.transform(coverageMap);
    const fileCoverage = mapped.fileCoverageFor(sourceFileSlash);

    assert.deepEqual(fileCoverage.data.b, {
      0: [0, 1],
    });

    assert.deepEqual(fileCoverage.data.branchMap["0"].locations, [
      {
        start: {
          line: 5,
          column: 4,
        },
        end: {
          line: 8,
          column: 15,
        },
      },
      {
        start: {
          line: undefined,
          column: undefined,
        },
        end: {
          line: undefined,
          column: undefined,
        },
      },
    ] as unknown as Range[]);
  });

  it("implicit else does not crash on edge case (#706)", async () => {
    const implicitElseCoverageData = implicitElseEdgeCase;

    const sourceMap = {
      version: 3,
      sources: [sourceFileSlash],
      mappings:
        ";;;;;;;;;;;;AAEO,aAAM,iBAAiB;AAAA,EAC5B,OAAsB,WAAsB;AAC1C,QAAI,WAAW;AAEb,WAAK,SAAS;AAAA,IAChB;AAEA,QAAI,cAAc,aAAa;AAE7B,WAAK,SAAS;AAAA,IAChB;AAAA,EACF;AACF;AAXE;AAAA,EAAQ;AAAA,GADG,iBACX;AAaF,SAAS,cACP,SACA,cACA,iBACA;AAAC;AAIH,SAAS,QAAQ,OAAkB;AAEnC;",
    } as unknown as EncodedSourceMap;

    const coverageMap = createMap({});
    coverageMap.addFileCoverage(implicitElseCoverageData as unknown as FileCoverageData);

    const transformer = new SourceMapTransformer(() => new TraceMap(sourceMap));

    await transformer.transform(coverageMap);
  });

  it("correctly maps function without `}` mapping", async () => {
    const sourceMap = {
      version: 3,
      sources: [sourceFileSlash],
      mappings:
        "AAAA,OAAO,SAAS,OAAO,GAAW;AAChC,QAAO,IAAI,MAAM;;AAGnB,OAAO,SAAS,MAAM,GAAW;AAC/B,QAAO,CAAC,OAAO,EAAE",
    } as unknown as EncodedSourceMap;

    const coverageMap = createMap({});
    coverageMap.addFileCoverage(
      functionWithoutClosingBraceCoverageData as unknown as FileCoverageData,
    );

    const transformer = new SourceMapTransformer(() => new TraceMap(sourceMap));

    const mapped = await transformer.transform(coverageMap);
    const fileCoverage = mapped.fileCoverageFor(sourceFileSlash);

    assert.deepEqual(fileCoverage.data.f, {
      0: 1,
      1: 0,
    });

    assert.deepEqual(fileCoverage.data.fnMap["0"], {
      name: "isEven",
      decl: {
        start: {
          line: 1,
          column: 16,
        },
        end: {
          line: 1,
          column: 23,
        },
      },
      loc: {
        start: {
          line: 1,
          column: 34,
        },
        end: {
          line: 2,
          column: Infinity,
        },
      },
    } as FunctionMapping);
  });
});
