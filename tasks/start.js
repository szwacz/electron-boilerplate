'use strict';

var electron = require('electron-prebuilt');
var childProcess = require('child_process');
var utils = require('./utils');
var gulp = require('gulp');

gulp.task('start', ['build', 'watch'], function () {
    var app = childProcess.spawn(electron, ['./build'], {
        stdio: 'inherit'
    });

    app.on('close', function (code) {
        // User closed the app. Kill the host process.
        process.exit();
    });
});
