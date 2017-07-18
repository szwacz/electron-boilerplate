const path = require('path');
const jetpack = require('fs-jetpack');
const rollup = require('rollup').rollup;

const nodeBuiltInModules = ['assert', 'buffer', 'child_process', 'cluster',
  'console', 'constants', 'crypto', 'dgram', 'dns', 'domain', 'events',
  'fs', 'http', 'https', 'module', 'net', 'os', 'path', 'process', 'punycode',
  'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers',
  'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

const electronBuiltInModules = ['electron'];

const generateExternalModulesList = () => {
  const appManifest = jetpack.read('./package.json', 'json');
  return [].concat(
    nodeBuiltInModules,
    electronBuiltInModules,
    Object.keys(appManifest.dependencies),
    Object.keys(appManifest.devDependencies)
  );
};

const cached = {};

module.exports = (src, dest, opts) => {
  const options = opts || {};

  const plugins = [
    // Add rollup plugins here
  ];

  return rollup({
    entry: src,
    external: generateExternalModulesList(),
    cache: cached[src],
    plugins: plugins.concat(options.rollupPlugins || []),
  })
  .then((bundle) => {
    cached[src] = bundle;

    const jsFile = path.basename(dest);
    return bundle.generate({
      format: 'cjs',
      sourceMap: true,
      sourceMapFile: jsFile,
    }).then(result => {
      // Wrap code in self invoking function so the constiables don't
      // pollute the global namespace.
      const isolatedCode = `(function () {${result.code}\n}());`;
      return Promise.all([
        jetpack.writeAsync(dest, `${isolatedCode}\n//# sourceMappingURL=${jsFile}.map`),
        jetpack.writeAsync(`${dest}.map`, result.map.toString()),
      ]);
    })
  });
};
