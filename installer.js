#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')

deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  const rootPath = __dirname
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'ReadhubApp-win32-ia32'),
    exe: 'ReadhubApp.exe',
    iconUrl: 'file://' + rootPath + 'assets/icons/win/icon.ico',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    setupExe: 'ReadhubAppSetup.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico'),
    skipUpdateIcon: true
  })
}

function deleteOutputFolder () {
  return new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '..', 'release-builds', 'windows-installer'), (error) => {
      error ? reject(error) : resolve()
    })
  })
}
