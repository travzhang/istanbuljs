# `@vitest/istanbuljs`

[![Build Status](https://travis-ci.org/istanbuljs/istanbuljs.svg?branch=main)](https://travis-ci.org/istanbuljs/istanbuljs)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![community slack](http://devtoolscommunity.herokuapp.com/badge.svg)](http://devtoolscommunity.herokuapp.com)

_Having problems? want to contribute? join our [community slack](http://devtoolscommunity.herokuapp.com)_.

> Everyone's favorite JS code coverage tool.

## About this Repo

This [monorepo](https://github.com/babel/babel/blob/main/doc/design/monorepo.md) contains the _nuts and bolts_ utility libraries that facilitate IstanbulJS test coverage; Why a monorepo?

- it allows us to more easily test API changes across coupled modules, e.g., changes to `istanbul-lib-coverage`
  potentially have an effect on `istanbul-lib-instrument`.
- it gives us a centralized repo for discussions about bugs and upcoming features.

## Where Should I Start

_You're probably actually looking for one of the following repos:_

- [nyc](https://github.com/istanbuljs/nyc): the IstanbulJS 2.0 command line interface, providing painless coverage support for [most popular testing frameworks](https://istanbul.js.org/docs/tutorials/).
- [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul): a babel plugin
  for instrumenting your ES2015+ code with Istanbul compatible coverage tracking.
- [istanbul](https://github.com/gotwarlost/istanbul): the legacy 1.0 IstanbulJS interface (you should
  now consider instead using nyc or babel-plugin-istanbul).

### Contributing

Contributing to the packages contained in this repo is easy:

1. after checking out, run `npm install` (this will run the lerna build).
2. to run all tests, simply run `npm test` in the root directory.
3. to run tests for a single package `cd package/:name` and run
   `npm test` within the package's folder.

### Credits

This package is originally a fork of [`istanbuljs/istanbuljs`](https://github.com/istanbuljs/istanbuljs) and was created based on https://github.com/vitest-dev/vitest/issues/9433.
We want to thank [`istanbuljs` organization](https://github.com/orgs/istanbuljs) and their contributors for all the past work.

This fork is building on top of `istanbuljs`'s ISC+BSD-3-Clause lisenced codebase. From `28ffdbc314596bdcb3007e85d30a62372602b262` forward all contributions are MIT lisenced. See each published NPM package for their specific lisencing and copyrights.

<!--
@vitest/coverage-istanbul
- istanbul-lib-coverage
- istanbul-lib-report (includes former istanbul-reports)
- istanbul-lib-instrument
- istanbul-lib-source-maps

@vitest/coverage-v8
- istanbul-lib-coverage
- istanbul-lib-report (includes former istanbul-reports)

Needed:
- istanbul-lib-coverage
- istanbul-lib-instrument
- istanbul-lib-report (includes former istanbul-reports)
- istanbul-lib-source-maps

```ts
import type { CoverageMap, CoverageMapData, CoverageSummary } from 'istanbul-lib-coverage'
import type { Instrumenter } from 'istanbul-lib-instrument'

import { createInstrumenter } from 'istanbul-lib-instrument'
import libCoverage from 'istanbul-lib-coverage'
import libSourceMaps from 'istanbul-lib-source-maps'
import libReport from 'istanbul-lib-report'

libReport.createContext
libReport.create
libCoverage.createCoverageMap
createInstrumenter
libSourceMaps.createSourceMapStore
```

--!>
