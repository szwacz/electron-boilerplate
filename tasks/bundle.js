'use strict';

var path = require('path');
var jetpack = require('fs-jetpack');
var rollup = require('rollup').rollup;

var nodeBuiltInModules = ['assert', 'buffer', 'child_process', 'cluster',
    'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events',
    'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'punycode',
    'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers',
    'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

var electronBuiltInModules = ['electron'];

var generateExternalModulesList = function () {
    var appManifest = jetpack.read('./package.json', 'json');
    return [].concat(
        nodeBuiltInModules,
        electronBuiltInModules,
        Object.keys(appManifest.dependencies),
        Object.keys(appManifest.devDependencies)
    );
};

var cached = {};

module.exports = function (src, dest, opts) {
    opts = opts || {};
    opts.rollupPlugins = opts.rollupPlugins || [];
    return rollup({
        entry: src,
        external: generateExternalModulesList(),
        cache: cached[src],
        plugins: opts.rollupPlugins,
    })
    .then(function (bundle) {
        cached[src] = bundle;

        var jsFile = path.basename(dest);
        var result = bundle.generate({
            format: 'cjs',
            sourceMap: true,
            sourceMapFile: jsFile,
        });
        // Wrap code in self invoking function so the variables don't
        // pollute the global namespace.
        var isolatedCode = '(function () {' + result.code + '\n}());';
        return Promise.all([
            jetpack.writeAsync(dest, isolatedCode + '\n//# sourceMappingURL=' + jsFile + '.map'),
            jetpack.writeAsync(dest + '.map', result.map.toString()),
        ]);
    });
};
