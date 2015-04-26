'use strict';

var Q = require('q');
var electron = require('electron-prebuilt');
var pathUtil = require('path');
var childProcess = require('child_process');
var utils = require('./utils');

var gulpPath = pathUtil.resolve('./node_modules/.bin/gulp');
if (process.platform === 'win32') {
    gulpPath += '.cmd';
}

var runBuild = function () {
    var deferred = Q.defer();

    var build = childProcess.spawn(gulpPath, [
        'build',
        '--env=' + utils.getEnvName(),
        '--color'
    ]);

    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);

    build.on('close', function (code) {
        deferred.resolve();
    });

    return deferred.promise;
};

var runGulpWatch = function () {
    var watch = childProcess.spawn(gulpPath, [
        'watch',
        '--env=' + utils.getEnvName(),
        '--color'
    ]);

    watch.stdout.pipe(process.stdout);
    watch.stderr.pipe(process.stderr);

    watch.on('close', function (code) {
        // Gulp watch exits when error occured during build.
        // Just respawn it then.
        runGulpWatch();
    });
};

var runApp = function () {
    var app = childProcess.spawn(electron, ['./build']);

    app.stdout.pipe(process.stdout);
    app.stderr.pipe(process.stderr);

    app.on('close', function (code) {
        // User closed the app. Kill the host process.
        process.exit();
    });
};

runBuild()
.then(function () {
    runGulpWatch();
    runApp();
});
