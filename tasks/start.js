'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var extend = require('util')._extend;
var util = require("gulp-util");

// app environment variables
var app_env = extend({}, process.env);

// app location
var build_path = './build';

// browser sync configuration
var bs_options = {
    port: 3002,
    ghostMode: false,
    logSnippet: false,
    open: false,
    notify: false,
    ui: false,
    socket: {domain: getBrowserSyncRootUrl}
};

// Build and run the Electron App and rebuild when files change
gulp.task('start', ['build', 'watch'], function () {

    // BrowserSync
    var bs;

    // Using BrowserSync (optional)
    if (bs = initBrowserSync()) {
        // Add BrowserSync Client URL to app environment
        app_env.BROWSER_SYNC_CLIENT_URL = getBrowserSyncClientUrl(bs.instance.options);

        // reload on HTML and JS changes
        bs.watch([
            build_path + '/app.js',
            build_path + '/*.html'
        ]).on('change', bs.reload);

        // Stream the CSS updates
        var css = build_path + '/stylesheets/*.css';
        bs.watch(css).on('change', function () {
            gulp.src(css).pipe(bs.stream());
        });
    }

    // start the electron app
    childProcess.spawn(electron, [build_path], {
        stdio: 'inherit',
        env: app_env
    }).on('close', function () {
        // User closed the app. Kill the host process.
        process.exit();
    });
});


// Setup BrowserSync and catch errors gracefully
function initBrowserSync() {
    try {
        try {
            // Load on demand
            var BrowserSync = require("browser-sync");
        } catch (e) {
            // Fail politely
            util.log('Note: BrowserSync is available. "npm install browser-sync" to enable it.');
            return false;
        }
        // Create, initialize, and return a BrowserSync instance
        var bs = BrowserSync.create();
        bs.init(bs_options);
        return bs;
    } catch (e) {
        // Bad options, or something...
        console.error('Error starting BrowserSync', e);
        return false;
    }
}

// BrowserSync URL root
function getBrowserSyncRootUrl() {
    return 'http://localhost:' + bs_options.port;
}

// BrowserSync JS client URL
function getBrowserSyncClientUrl(options) {
    var connectUtils = require('browser-sync/lib/connect-utils');
    return getBrowserSyncRootUrl() + connectUtils.clientScript(options);
}
