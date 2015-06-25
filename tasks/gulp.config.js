/**
 * Created by Yail Anderson on 24/06/2015.
 */

module.exports = function () {

    var config = {

        jsCodeToTranspile: [
            'app/**/*.js',
            '!app/main.js',
            '!app/spec.js',
            '!app/node_modules/**',
            '!app/jspm_packages/**',
            '!app/bower_components/**',
            '!app/vendor/**'
        ],
        toCopy: [
            'app/main.js',
            'app/spec.js',
            'app/node_modules/**',
            'app/jspm_packages/**',
            'app/bower_components/**',
            'app/vendor/**',
            'app/**/*.html'
        ]
    };

    return config;
};
