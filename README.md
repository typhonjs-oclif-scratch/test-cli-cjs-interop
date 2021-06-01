# test-cli-cjs-interop
[![Build Status](https://github.com/typhonjs-oclif-scratch/test-cli-cjs-interop/workflows/CI/CD/badge.svg)](#)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-oclif-scratch/test-cli-cjs-interop.svg)](https://codecov.io/github/typhonjs-oclif-scratch/test-cli-cjs-interop)

Provides a named export / CommonJS (CJS) interop test CLI for ES Module (ESM) changes to @oclif v2 against Node 
`12.17.0+` and `14.0.0+`. This is the recommended option for widest coverage of the Node ecosystem for ESM Oclif CLIs.

There are three test suites for ESM support for Oclif v2:
- [test-cli-modern](https://github.com/typhonjs-oclif-scratch/test-cli-modern) / everything works as expected
- test-cli-cjs-interop (this one) / workaround for CJS named exports
- [test-cli-experimental-modules](https://github.com/typhonjs-oclif-scratch/test-cli-experimental-modules) / usage of 
  --experimental-modules + workaround for CJS named exports (not recommended)

This test CLI and Github Action CI / CD test suite covers the largest swath of Node versions not requiring 
`--experimental-modules` starting at `12.17.0` and all of `14.0.0+` by taking into account CJS named export interop. 

A [discussion issue](https://github.com/oclif/core/issues/130) about ESM support has concluded with a merge of ESM
support on the `@oclif/core` repo. Please see this [comment](https://github.com/oclif/core/issues/130#issuecomment-852454758)
on updated details on how to publish an ESM Oclif v2 CLI before the full launch of Oclif v2.

Click here to view the [latest Action CI / CD run](https://github.com/typhonjs-oclif-scratch/test-cli-cjs-interop/actions)
(requires a valid Github login). The test suite is run in a matrix support `macos-latest`, `ubuntu-latest`, `windows-latest`
on Node versions `12.17.0`, `12.x`, `14.0.0`, `14.x`, `16.0.0` and `16.x`.

All the test suites use [@oclif/core](https://github.com/oclif/core) `0.5.10+`.

For testing the CLI is invoked locally along with a programmatic tests.

It should be noted that everything is ESM from the test CLI to the test suite itself. This test suite demonstrates that 
it is possible to launch an Oclif ESM CLI with very wide support for the Node ecosystem version `12.17.0+` and all of 
`14.0.0+`. Please review the `test-cli-modern` version for Node `12.20.0+` & `14.13.0+` as well. The main caveat that 
this test suite deals with is Node versions between when `--experimental-modules` is not needed and when CJS named 
exports is properly supported.

----
### Bin / Bootstrap

Take note that in `package.json` `"type": "module"` is set. As things go this requires the bin bootstrap file
`./bin/run` to be renamed to `./bin/run.js` to support ESM. Unlike `test-cli-experimental-modules` the bootstrap 
file is straightforward and invokes Node as per normal. 

----
### CJS named exports

The next area of note regarding a workaround is that until Node version `12.20.0+` and `14.13.0+` that one can not
import via standard ESM mechanisms named exports from CJS modules. Since Oclif is a CJS module one must import Oclif
as the entire package as a default export.

Instead of `import { Command } from '@oclif/core'` one must do the following `import oclif from '@oclif/core'` then
subsequently reference Command as `oclif.Command`.

For more information on CJS named exports please see this [Node / Modules issue](https://github.com/nodejs/modules/issues/81).

----
### Mocha Tests

The test source contains a [programmatic test](https://github.com/typhonjs-oclif-scratch/test-cli-cjs-interop/blob/main/test/src/programmatic.test.js)
and [spawn tests](https://github.com/typhonjs-oclif-scratch/test-cli-cjs-interop/blob/main/test/src/spawn.test.js). To 
accomplish this cross platform with Windows [cross-spawn](https://www.npmjs.com/package/cross-spawn)
is utilized. The local bootstrap code, `./bin/run.js` is invoked. These tests cover execution for the CLI across
MacOS, Ubuntu, and Windows and a wide range of Node versions proving it is possible to create an ESM Oclif CLI that
can run on Node `12.17.0+` without using `--experimental-modules`.

----
### Code Coverage

[nyc](https://www.npmjs.com/package/nyc) does not support code coverage for ESM based tests in Mocha presently. The
solution is to use [c8](https://www.npmjs.com/package/c8) which does work with ESM tests and is a drop in replacement
for `nyc`. This repo uses Codecov to publish a [coverage report](https://codecov.io/github/typhonjs-oclif-scratch/test-cli-cjs-interop)
in the GH Action. When running tests locally a `./coverage` directory is created that contains the coverage report. As
can be seen in the report full coverage of both the CLI command / init files and bin bootstrap occurs. 

----
### Deploying an ESM CLI

While there is newly added ESM support to `@oclif/core v0.5.10+` the rest of the Oclif v2 infrastructure and plugins are
not updated to use `@oclif/core` yet. This is somewhat problematic in using `@oclif/dev-cli v1.26.0` and in particular the
`oclif-dev manifest` CLI command in the `prepack` or `prepublishOnly` NPM scripts. There is a workaround though to
publish ESM Oclif v2 CLIs using the `oclif-dev manifest` command. It requires installing all dependencies from Oclif v2
then manually updating `@oclif/config` which is the v1 version depended on by `@oclif/dev-cli`. ESM support has been
back-ported with a hard fork of `@oclif/config v1` in this [repository](https://github.com/typhonjs-oclif-scratch/configv1).

The contents of the lib directory from the above repository needs to be copied into `node_modules/@oclif/config/lib` as
it adds ESM config loading support to `@oclif/config v1`

Note: This workaround only works with `oclif-dev manifest` command and not the README command.

A comment tracking the current best practice or procedure to publish an ESM Oclif v2 CLI is posted [here](https://github.com/oclif/core/issues/130#issuecomment-852454758).
When Oclif v2 fully launches no workarounds will be necessary.
