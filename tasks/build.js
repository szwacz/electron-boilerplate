'use strict';

var gulp = require('gulp');
// load all gulp plugins
var $ = require('gulp-load-plugins')({lazy: true});

var jetpack = require('fs-jetpack');

// own modules
var utils = require('./utils');
var config = require('./gulp.config')();

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

// -------------------------------------
// Tasks
// -------------------------------------

var transpileTask = function () {
    return gulp.src(config.jsCodeToTranspile, { base: './app' })
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write("."))
        .pipe(gulp.dest(destDir.path()));
};

gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: config.toCopy
    });
};

gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);

gulp.task('transpile', ['clean'], transpileTask);
gulp.task('transpile-watch', transpileTask);


var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
    .pipe($.less())
    .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);


gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    switch (utils.getEnvName()) {
        case 'development':
            // Add "dev" suffix to name, so Electron will write all
            // data like cookies and localStorage into separate place.
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
        case 'test':
            // Add "test" suffix to name, so Electron will write all
            // data like cookies and localStorage into separate place.
            manifest.name += '-test';
            manifest.productName += ' Test';
            // Change the main entry to spec runner.
            manifest.main = 'spec.js';
            break;
    }
    destDir.write('package.json', manifest);

    var configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json');
    destDir.copy(configFilePath, 'env_config.json');
});


gulp.task('watch', function () {
    gulp.watch(config.jsCodeToTranspile, ['transpile-watch']);
    gulp.watch(config.toCopy, ['copy-watch']);
    gulp.watch('app/**/*.less', ['less-watch']);
});


gulp.task('build', ['transpile', 'less', 'copy', 'finalize']);

gulp.task('default', ['build']);
