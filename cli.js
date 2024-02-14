#!/usr/bin/env node

const { parseArgs } = require('util')
const { execSync } = require('child_process')
const { getVisualStudioPaths, getVsDevCmdPath } = require('.')

const {
  values: { version }
} = parseArgs({
  options: {
    version: {
      type: 'string',
      short: 'v'
    }
  }
})

if (!version) {
  console.error('Version argument is a required.')
  process.exit(-1)
}

const paths = getVisualStudioPaths()

if (!paths[version]) {
  console.error(`Couldn't find Visual Studio ${version} path.`)
  process.exit(-1)
}

try {
  execSync(getVsDevCmdPath(paths[version]))
  console.log('Visual Studio environment variables have been set.')
} catch (error) {
  console.error('Failed to set Visual Studio environment variables.', error)
}
