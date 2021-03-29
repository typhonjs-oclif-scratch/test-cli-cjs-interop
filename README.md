# test-cli-cjs-interop
Provides a named export / CommonJS (CJS) interop test CLI for ES Module (ESM) changes to @oclif v2 against Node 
12.17.0+, 13.x, 14.0.0+ and 15.0.0+

There are three test suites for ESM support for Oclif v2:
- [test-cli-modern](https://github.com/typhonjs-oclif/test-cli-modern) / everything works as expected
- test-cli-cjs-interop (this one) / workaround for CJS named exports
- [test-cli-experimental-modules](https://github.com/typhonjs-oclif/test-cli-experimental-modules) / usage of 
  --experimental-modules + workaround for CJS named exports

This test CLI and Github Action CI / CD test suite covers the largest swath of Node versions not requiring 
`--experimental-modules` starting at `12.17.0` and all of `14.0.0+` by taking into account CJS named export interop. 

A [discussion issue](https://github.com/oclif/core/issues/130) about ESM support is open on the `@oclif/core` repo.

Click here to view the [latest Action CI / CD run](https://github.com/typhonjs-oclif/test-cli-cjs-interop/actions)
(requires a valid Github login). The test suite is run in a matrix support `macos-latest`, `ubuntu-latest`, `windows-latest`
on Node versions `12.17.0`, `12.x`, `13.x`, `14.0.0`, `14.x`, `15.0.0` and `15.x`.

All the test suites use a fork of [@oclif/core](https://github.com/oclif/core) that can be [found here](https://github.com/typhonjs-oclif-scratch/core-esm)
and subsequently a compiled version with the lib directory committed to Github is [found here](https://github.com/typhonjs-oclif/core-esm).
The latter Github repo is linked in `package.json` as `"@oclif/core": "git+https://github.com/typhonjs-oclif/core-esm.git"`.

For testing the CLI is invoked locally, via NPM script (installed as a developer dependency), and installed as a global
dependency in the Github Action along with a programmatic test.

It should be noted that everything is ESM from the test CLI to the test suite itself. This test suite demonstrates that 
it is possible to launch an Oclif ESM CLI with very wide support for the Node ecosystem version `12.17.0+` and all of 
`14.0.0+` however for practical purposes the `modern` version for Node `12.20.0+` & `14.13.0+` is the recommended 
solution for Oclif v2. The main caveat that this test suite deals with is the Node versions between when 
`--experimental-modules` is not needed and when CJS named exports is properly supported.

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

The test source contains a [programmatic test](https://github.com/typhonjs-oclif/test-cli-cjs-interop/blob/main/test/src/programmatic.test.js)
and [spawn tests](https://github.com/typhonjs-oclif/test-cli-cjs-interop/blob/main/test/src/spawn.test.js). To 
accomplish this cross platform with Windows [cross-spawn](https://www.npmjs.com/package/cross-spawn)
is utilized. The local bootstrap code, `./bin/run.js` is invoked along with the NPM script `run-npm-cli` that invokes
the CLI that has been installed via a Github link developer dependency and finally in the Github Action where the test
CLI is installed globally it is invoked as well. These tests cover all execution possibilities for the CLI across
MacOS, Ubuntu, and Windows and a wide range of Node versions proving it is possible to create an ESM Oclif CLI that
can run on Node `12.17.0+` without using `--experimental-modules`.
