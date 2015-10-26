// Spec files are scattered through the whole project. Here we're searching
// for them and generate one entry file which will run all the tests.

'use strict';

var jetpack = require('fs-jetpack');
var srcDir = jetpack.cwd('app');

var fileName = 'spec.js';
var fileBanner = "// This file is generated automatically.\n"
    + "// All your modifications to it will be lost (so don't do it).\n";
var whatToInclude = [
    '*.spec.js',
    '!node_modules/**',
];

module.exports = function () {
    return srcDir.findAsync('.', { matching: whatToInclude }, 'relativePath')
    .then(function (specPaths) {
        var fileContent = specPaths.map(function (path) {
            return 'import "' + path + '";';
        }).join('\n');
        return srcDir.writeAsync(fileName, fileBanner + fileContent);
    })
    .then(function () {
        return srcDir.path(fileName);
    });
};
