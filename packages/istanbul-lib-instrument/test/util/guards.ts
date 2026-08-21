function tryThis(str: string, feature?: string, generateOnly?: boolean): boolean {
  if (!generateOnly) {
    try {
      eval(str);
    } catch (ex) {
      console.error("ES6 feature [" + feature + "] is not available in this environment");
      return false;
    }
  }
  return true;
}

function isYieldAvailable(): boolean {
  return tryThis("function *foo() { yield 1; }", "yield");
}

function isClassPropAvailable(): boolean {
  return tryThis("class Foo { a = 1; }", "class property");
}

function isClassPrivatePropAvailable(): boolean {
  return tryThis("class Foo { #a = 1; }", "class private property");
}

function isForOfAvailable(): boolean {
  return tryThis("function *foo() { yield 1; }\n" + "for (var k of foo()) {}", "for-of");
}

function isArrowFnAvailable(): boolean {
  return tryThis("[1 ,2, 3].map(x => x * x)", "arrow function");
}

function isObjectSpreadAvailable(): boolean {
  return tryThis("const a = {...{b: 33}}", "object-spread");
}

function isObjectFreezeAvailable(): boolean {
  if (!Object.freeze) {
    return false;
  }
  const foo: any = Object.freeze({});
  try {
    foo.bar = 1;
    return false;
  } catch (ex) {
    return true;
  }
}

function isOptionalCatchBindingAvailable(): boolean {
  return tryThis("try {} catch {}");
}

function isImportAvailable(): boolean {
  return tryThis('import fs from "fs"', "import", true);
}

function isExportAvailable(): boolean {
  return tryThis("export default function foo() {}", "export", true);
}

function isDefaultArgsAvailable(): boolean {
  return tryThis("function foo(a=1) { return a + 1; }", "default args");
}

function isInferredFunctionNameAvailable(): boolean {
  return tryThis(
    'const foo = function () {}; if (foo.name !== "foo") throw new Error("name not inferred")',
  );
}

function isInferredClassNameAvailable(): boolean {
  return tryThis(
    'const foo = class {}; if (foo.name !== "foo") throw new Error("name not inferred")',
  );
}

function isClassAvailable(): boolean {
  return tryThis("new Function('args', '{class Foo extends (Bar) {}}')");
}

export {
  isClassAvailable,
  isInferredClassNameAvailable,
  isInferredFunctionNameAvailable,
  isDefaultArgsAvailable,
  isExportAvailable,
  isImportAvailable,
  isOptionalCatchBindingAvailable,
  isObjectFreezeAvailable,
  isYieldAvailable,
  isClassPropAvailable,
  isClassPrivatePropAvailable,
  isForOfAvailable,
  isArrowFnAvailable,
  isObjectSpreadAvailable,
};
