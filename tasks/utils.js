'use strict';

var argv = require('yargs').argv;

exports.getEnvName = function () {
    return argv.env || 'development';
};

exports.beepSound = function () {
    process.stdout.write('\u0007');
};
