'use strict';

var argv = require('yargs').argv;
var os = require('os');
var jetpack = require('fs-jetpack');

module.exports.os = function () {
    switch (os.platform()) {
        case 'darwin':
            return 'osx';
        case 'linux':
            return 'linux';
        case 'win32':
            return 'windows';
    }
    return 'unsupported';
};

module.exports.replace = function (str, patterns) {
    Object.keys(patterns).forEach(function (pattern) {
        var matcher = new RegExp('{{' + pattern + '}}', 'g');
        str = str.replace(matcher, patterns[pattern]);
    });
    return str;
};

module.exports.getEnvName = function () {
    return argv.env || 'development';
};

module.exports.getManifest = function () {
    return jetpack.read(__dirname + '/../package.json', 'json');
};

module.exports.getElectronVersion = function () {
    return module.exports.getManifest().devDependencies['electron-prebuilt'].substring(1);
};

module.exports.getRuntimePath = function () {
    var runtimePath = module.exports.getManifest().runtimePath;
    switch (module.exports.os()) {
        case 'osx':
            return runtimePath || 'node_modules/electron-prebuilt/dist/Electron.app';
        break;
        case 'linux':
        case 'windows':
            return runtimePath || 'node_modules/electron-prebuilt/dist';
        break;
        default:
            throw new Error('Unsupported os: ' + module.exports.os());
        break;
    }
};
