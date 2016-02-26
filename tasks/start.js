'use strict';

var Q = require('q');
var electron = require('electron-prebuilt');
var pathUtil = require('path');
var childProcess = require('child_process');
var kill = require('tree-kill');
var utils = require('./utils');
var watch;
var shuttingDown = false;

var gulpPath = pathUtil.resolve('./node_modules/.bin/gulp');

var runBuild = function () {
    var deferred = Q.defer();

    var build = childProcess.spawn(utils.spawnablePath(gulpPath), [
        'build',
        '--env=' + utils.getEnvName(),
        '--color'
    ], {
        stdio: 'inherit'
    });

    build.on('close', function (code) {
        deferred.resolve();
    });

    return deferred.promise;
};

var runGulpWatch = function () {
    watch = childProcess.spawn(utils.spawnablePath(gulpPath), [
        'watch',
        '--env=' + utils.getEnvName(),
        '--color'
    ], {
        stdio: 'inherit'
    });

    watch.on('close', function (code) {

        // If we are manually shutting down, stop here.
        if (shuttingDown) return;
      
        // Gulp watch exits when error occured during build.
        // Just respawn it then.
        runGulpWatch();
    });
};

var runApp = function () {
    var app = childProcess.spawn(electron, ['./build'], {
        stdio: 'inherit'
    });

    app.on('close', function(code) {
        // Flag the current status so we don't auto-restart the other tasks.
        shuttingDown = true;
      
        // User closed the app. Kill the host process.
        kill(watch.pid, 'SIGKILL', function () {
            process.exit();
        });
    });
};

runBuild()
.then(function () {
    runGulpWatch();
    runApp();
});
