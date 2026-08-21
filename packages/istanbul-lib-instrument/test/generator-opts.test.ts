import type { ParserPlugin } from "@babel/parser";
import { assert, describe, it, expect } from "vitest";

import Instrumenter from "../src/instrumenter";

const codeWithImportAttribute = `
  import foo from 'bar' with { type: 'json' };
`;

const generateCode = (
  code: string,
  parserPlugins: ParserPlugin[],
  generatorOpts?: Record<string, unknown>,
) => {
  const opts = {
    esModules: true,
    produceSourceMap: true,
    parserPlugins,
    generatorOpts,
  };
  const instrumenter = new Instrumenter(opts);
  return instrumenter.instrumentSync(code, import.meta.filename);
};

describe("generatorOpts", () => {
  describe("when the code has import attributes", () => {
    describe('using "with" importAttributesKeyword', () => {
      it("should produce configured keyword", () => {
        const generated = generateCode(
          codeWithImportAttribute,
          [["importAttributes", { deprecatedAssertSyntax: true }]],
          { importAttributesKeyword: "with" },
        );
        assert(generated);
        assert(typeof generated === "string");
        assert(generated.includes("with{type:'json'}"));
      });
    });

    describe('using "assert" importAttributesKeyword', () => {
      it("should produce configured keyword", () => {
        const generated = generateCode(
          codeWithImportAttribute,
          [["importAttributes", { deprecatedAssertSyntax: true }]],
          { importAttributesKeyword: "assert" },
        );
        assert(generated);
        assert(typeof generated === "string");
        assert(generated.includes("assert{type:'json'}"));
      });
    });
  });
});
