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

module.exports.getSigningId = function () {
    return argv.sign;
};

module.exports.spawnScriptPath = function (path) {
    if (process.platform === 'win32') {
        return path + '.cmd';
    }
    return path;
};
