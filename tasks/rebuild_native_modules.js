// Rebuilds native node modules for Electron.
// More: https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md

'use strict';

var path = require('path');
var Q = require('q');
var electron = require('electron-prebuilt');
var electronPackage = require('electron-prebuilt/package.json');
var rebuild = require('electron-rebuild');

var pathToElectron = path.join(__dirname, '../node_modules/electron-prebuilt/dist/electron');
var pathToElectronNativeModules = path.join(__dirname, '../app/node_modules');
var preGypFix = process.argv[2] === 'preGypFix';

rebuild.shouldRebuildNativeModules(electron)
  .then(function(shouldBuild) {
    if (!preGypFix && !shouldBuild) {
      return true;
    }

    if (preGypFix) {
      console.log('Forced Rebuilding native modules for Electron due to preGypFix...');
    } else {
      console.log('Rebuilding native modules for Electron...');
    }

    return rebuild.installNodeHeaders(electronPackage.version)
      .then(function() {
        return rebuild.rebuildNativeModules(electronPackage.version, pathToElectronNativeModules);
      })
      .then(function() {
        if (preGypFix) {
          console.log('Copying built modules due to preGypFix');
          rebuild.preGypFixRun('../app/node_modules', true, pathToElectron)
        }
      });
  })
  .then(function() {
    console.log('Rebuilding complete.');
  })
  .catch(function(err) {
    console.error("Rebuilding error!");
    console.error(err);
  });
