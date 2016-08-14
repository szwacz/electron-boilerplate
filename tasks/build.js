'use strict';

var pathUtil = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');

var bundle = require('./bundle');
var generateSpecsEntryFile = require('./generate_specs_entry_file');
var utils = require('./utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./src');
var destDir = projectDir.cwd('./app');

// -------------------------------------
// Tasks
// -------------------------------------

var bundleApplication = function () {
    return Promise.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(srcDir.path('app.js'), destDir.path('app.js')),
        ]);
};

var bundleSpecs = function () {
    return generateSpecsEntryFile().then(function (specEntryPointPath) {
        return bundle(specEntryPointPath, destDir.path('app.js'));
    });
};

gulp.task('bundle', function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
});

gulp.task('less', function () {
    return gulp.src(srcDir.path('stylesheets/main.less'))
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', done);
    }));
    watch('src/**/*.less', batch(function (events, done) {
        gulp.start('less', done);
    }));
});

gulp.task('build', ['bundle', 'less', 'environment']);
