'use strict';

var argv = require('minimist')(process.argv);

exports.getEnvName = function () {
    return argv.env || 'development';
};

exports.beepSound = function () {
    process.stdout.write('\u0007');
};
