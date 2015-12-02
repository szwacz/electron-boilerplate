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

module.exports.convertToRtf = function (plain) {
    plain = plain.replace(/\n/g, "\\par\n");
    return "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang2057{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}}\n\\viewkind4\\uc1\\pard\\f0\\fs17 " + plain + "\\par\n}";
};

module.exports.getEnvName = function () {
    return argv.env || 'development';
};

module.exports.getSigningId = function () {
    return argv.sign;
};

module.exports.getElectronVersion = function () {
    var manifest = jetpack.read(__dirname + '/../package.json', 'json');
    return manifest.devDependencies['electron-prebuilt'].substring(1);
};
module.exports.useWix = function () {
    return !(argv.wix === undefined);
};
