'use strict';

var argv = require('yargs').argv;
var os = require('os');
var extend = require('util')._extend;

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

module.exports.getSigningId = function (manifest) {
    return argv.sign || (manifest.osx.codeSignIdentitiy ? manifest.osx.codeSignIdentitiy.dmg : undefined);
};

module.exports.getMASSigningId = function (manifest) {
    return argv['mas-sign'] || (manifest.osx.codeSignIdentitiy ? manifest.osx.codeSignIdentitiy.MAS : undefined);
};

module.exports.getMASInstallerSigningId = function (manifest) {
    return argv['mas-installer-sign'] || (manifest.osx.codeSignIdentitiy ? manifest.osx.codeSignIdentitiy.MASInstaller : undefined);
};

module.exports.releaseForMAS = function () {
    return !!argv.mas;
};

// Fixes https://github.com/nodejs/node-v0.x-archive/issues/2318
module.exports.spawnablePath = function (path) {
    if (process.platform === 'win32') {
        return path + '.cmd';
    }
    return path;
};


// return BrowserSync URL root
var getBrowserSyncRootUrl = module.exports.getBrowserSyncRootUrl = function (options) {
    return 'http://localhost:' + options.get('port');
};

// return BrowserSync JS client URL
module.exports.getBrowserSyncClientUrl = function (options) {
    var connectUtils = require('browser-sync/lib/connect-utils');
    return getBrowserSyncRootUrl(options) + connectUtils.clientScript(options);
};

// Setup BrowserSync and catch errors gracefully
module.exports.initBrowserSync = function (bs_opts, ready) {
    var bs = require("browser-sync").create();
    var opts = extend({
        ui: false,
        port: 35829,
        ghostMode: false,
        open: false,
        notify: false,
        logSnippet: false,
        socket: {domain: getBrowserSyncRootUrl}
    }, bs_opts);
    var err;
    try {
        bs.init(opts, function (){
            ready( err ? null : bs);
        });
    } catch (e) {
        err = e;
        console.error('Error starting BrowserSync', e);
    }
};

