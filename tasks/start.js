'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');

gulp.task('start', ['build', 'watch'], function () {
    childProcess.spawn(electron, ['./build'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        // User closed the app. Kill the host process.
        process.exit();
    });
});

gulp.task('test', ['build'], function () {
    childProcess.spawn(electron, ['./build'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        process.exit();
    });
});
