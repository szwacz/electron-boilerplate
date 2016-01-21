/*
This script compiles native modules for Electron.
If you don't plan to use native modules you can delete this file.

But if you'd like to use them do those steps...

1. Go to main project's directory and run:
npm install electron-rebuild --save-dev

2. Then go to app folder:
cd app

3. Add to app/package.json lines:
"scripts": {
  "postinstall": "node ../tasks/rebuild_native"
}

4. Now install your native module:
npm install my_native_module --save

5. Trigger once again full npm install so electron-rebuild can do it's job:
npm install

6. Enjoy your native module!
*/

'use strict';

var childProcess = require('child_process');
var path = require('path');
var Q = require('q');
var electron = require('electron-prebuilt');
var electronPackage = require('electron-prebuilt/package.json');
var rebuild = require('electron-rebuild');

var pathToElectronNativeModules = path.join(__dirname, '../app/node_modules');

rebuild.shouldRebuildNativeModules(electron)
.then(function (shouldBuild) {
    if (!shouldBuild) {
        return true;
    }

    console.log('Rebuilding native modules for Electron...');

    return rebuild.installNodeHeaders(electronPackage.version)
    .then(function () {
        return rebuild.rebuildNativeModules(electronPackage.version, pathToElectronNativeModules);
    });
})
.then(function () {
    console.log('Rebuilding complete.');
})
.catch(function (err) {
    console.error("Rebuilding error!");
    console.error(err);
});
