'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var extend = require('util')._extend;
var utils = require('./utils');

var buildPath = './build';

gulp.task('start', ['build', 'watch'], function () {

    utils.initBrowserSync({port: 3002}, function(bs) {

        var env = extend({}, process.env);

        if(bs && bs.active) {

            // Add BrowserSync Client URL to app environment
            env.BROWSER_SYNC_CLIENT_URL = utils.getBrowserSyncClientUrl(bs.instance.options);

            // watch for HTML and JS changes
            bs.watch([buildPath+'/app.js', buildPath+'/*.html']).on('change', bs.reload);

            // Stream the CSS updates
            var css = buildPath+'/stylesheets/*.css';
            bs.watch(css).on('change', function () {
                gulp.src(css).pipe(bs.stream());
            });
        }

        // start the electron app
        childProcess.spawn(electron, [buildPath], {
                stdio: 'inherit',
                env: env
            })
            .on('close', function () {
                // User closed the app. Kill the host process.
                process.exit();
            });
    });
});
