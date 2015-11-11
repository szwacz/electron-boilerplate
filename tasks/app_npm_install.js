// This script allows you to install native modules (those which have
// to be compiled) for your Electron app.
// The problem is that 'npm install' compiles them against node.js you have
// installed on your computer, NOT against node.js used inside Electron.
// To compile them agains Electron we need to tell npm it explicitly (and
// that's what this script does).

'use strict';

var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var argv = require('yargs').argv;

var utils = require('./utils');

var electronVersion = utils.getElectronVersion();

var nodeModulesDir = jetpack.cwd(__dirname + '/../app/node_modules')
var dependenciesCompiledAgainst = nodeModulesDir.read('electron_version');

// When you raise version of Electron used in your project, the safest
// thing to do is remove all installed dependencies and install them
// once again (so they compile against new version if you use any
// native package).
if (electronVersion !== dependenciesCompiledAgainst) {
    nodeModulesDir.dir('.', { empty: true });
    // Save the version string in file next to all installed modules so we know
    // in the future what version of Electron has been used to compile them.
    nodeModulesDir.write('electron_version', electronVersion);
}

// Tell the 'npm install' that we want to compile for Electron.
process.env.npm_config_disturl = "https://atom.io/download/atom-shell";
process.env.npm_config_target = electronVersion;

var params = ['install'];
// Maybe there was name of package user wants to install passed
// as a parameter to this script.
if (argv._.length > 0) {
    params.push(argv._[0]);
    params.push('--save');
}

var installCommand;
if (process.platform === 'win32') {
  installCommand = 'npm.cmd'
} else {
  installCommand = 'npm'
}

var install = childProcess.spawn(installCommand, params, {
    cwd: __dirname + '/../app',
    env: process.env,
    stdio: 'inherit'
});
