'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');

var bundle = require('./bundle');
var generateSpecImportsFile = require('./generate_spec_imports');
var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./src');
var destDir = projectDir.cwd('./app');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return Q();
    // return destDir.dirAsync('.')
    // .then(function () {
    //     return destDir.findAsync({ matching: '!node_modules' });
    // })
    // .then(function (found) {
    //     var removingPromises = found.map(destDir.removeAsync);
    //     return Q.all(removingPromises);
    // });
});


var bundleApplication = function () {
    return Q.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(srcDir.path('app.js'), destDir.path('app.js')),
        ]);
};

var bundleSpecs = function () {
    return generateSpecImportsFile().then(function (specEntryPointPath) {
        return bundle(specEntryPointPath, destDir.path('spec.js'));
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
};
gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);


var lessTask = function () {
    return gulp.src(srcDir.path('stylesheets/main.less'))
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);


gulp.task('environment', ['clean'], function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'));
});


gulp.task('watch', function () {
    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle-watch', done);
    }));
    watch('src/**/*.less', batch(function (events, done) {
        gulp.start('less-watch', done);
    }));
});


gulp.task('build', ['bundle', 'less', 'environment']);
