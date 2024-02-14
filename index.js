const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const visualStudioVersionToYear = {
  10: '2010',
  11: '2012',
  12: '2013',
  14: '2015',
  15: '2017',
  16: '2019',
  17: '2022'
}

function findVsWhere () {
  const programFilesX86 = process.env['ProgramFiles(x86)'] || process.env.ProgramFiles
  const programFiles = process.env.ProgramFiles

  const vswherePathX86 = path.join(programFilesX86, 'Microsoft Visual Studio', 'Installer', 'vswhere.exe')

  try {
    fs.accessSync(vswherePathX86, fs.constants.F_OK)
    return vswherePathX86
  } catch (err) {
    if (programFilesX86 === programFiles) {
      throw new Error('vswhere.exe not found')
    }
    try {
      const vswherePath = path.join(programFiles, 'Microsoft Visual Studio', 'Installer', 'vswhere.exe')
      fs.accessSync(vswherePath, fs.constants.F_OK)
      return vswherePath
    } catch (err) {
      throw new Error('vswhere.exe not found')
    }
  }
}

function getVisualStudioPaths () {
  const locations = {}
  const vswherePath = findVsWhere()
  console.log(`vswhere.exe found at: ${vswherePath}`)
  const possibleLegacyVersions = [10, 11, 12, 13, 14]

  for (const version of possibleLegacyVersions) {
    const vswhereCommand = `"${vswherePath}" -legacy -version [${version},${version + 1}) -property installationPath`

    try {
      locations[visualStudioVersionToYear[version]] = execSync(vswhereCommand, { encoding: 'utf-8' }).trim()
    } catch (e) {
      console.log('No legacy versions')
    }
  }
  const possibleVersions = [15, 16, 17]

  for (const version of possibleVersions) {
    const vswhereCommand = `"${vswherePath}" -version [${version},${version + 1}) -property installationPath`

    try {
      locations[visualStudioVersionToYear[version]] = execSync(vswhereCommand, { encoding: 'utf-8' }).trim()
    } catch (e) {
      console.log('No versions')
    }
  }

  return Object.fromEntries(
    Object.entries(locations).filter(([key, value]) => value)
  )
}

function applyEnvironmentVariables (output) {
  const lines = output.split('\r\n')
  lines.forEach((line) => {
    const [key, ...values] = line.split('=')
    const value = values.join('=')
    if (key && value) {
      process.env[key] = value
    }
  })
}

function getVsDevCmdPath (installPath) {
  if (!installPath) throw new Error('Must provide installPath')

  let command = path.join(installPath, 'Common7', 'Tools', 'VsDevCmd.bat')
  try {
    fs.accessSync(command, fs.constants.F_OK)
  } catch (e) {
    command = path.join(installPath, 'Common7', 'Tools', 'vsvars32.bat')
  }

  return command
}

function overwriteCurrentEnvrionment (installPath) {
  try {
    applyEnvironmentVariables(execSync(`"${getVsDevCmdPath(installPath)}" && set`, { encoding: 'utf-8' }))
    console.log('Visual Studio environment variables have been set.')
  } catch (error) {
    console.error('Failed to set Visual Studio environment variables.', error)
  }
}

module.exports = { getVisualStudioPaths, getVsDevCmdPath, overwriteCurrentEnvrionment }
