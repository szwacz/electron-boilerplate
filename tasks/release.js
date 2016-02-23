'use strict';

var gulp = require('gulp');
var utils = require('./utils');

var releaseForOs = {
    osx: require('./release_osx'),
    osx_mas: require('./release_osx_mas'),
    linux: require('./release_linux'),
    windows: require('./release_windows'),
};

gulp.task('release', ['build'], function () {
     return releaseForOs[utils.os() + utils.MAS()]();
});
