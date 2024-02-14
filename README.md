# vs-dev-env

A CLI/package to call Visual Studio VsDevCmd.bat script and set the development environment.

[![npm status](http://img.shields.io/npm/v/vs-dev-env.svg)](https://www.npmjs.org/package/vs-dev-env)
[![Node version](https://img.shields.io/node/v/vs-dev-env.svg)](https://www.npmjs.com/package/vs-dev-env)
[![Standard](https://img.shields.io/badge/standard-informational?logo=javascript\&logoColor=fff)](https://standardjs.com)
[![Common Changelog](https://common-changelog.org/badge.svg)](https://common-changelog.org)

## Usage

### CLI

```
vs-dev-env --version 2017
```

### Module

#### `getVisualStudioPaths()`

Get an object of Visual Studio paths where key is year and value is path.

#### `overwriteCurrentEnvrionment()`

Overwrite the current process env.

## Install

With [npm](https://npmjs.org) do:

```
npm install vs-dev-env [-g]
```

## License

[MIT](LICENSE) © Shlomo Michael Rubin
