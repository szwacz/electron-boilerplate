module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Electron'],
    preprocessors: {
      './jasmine.shim.js': ['electron'],
      './build/**/*.spec.js': ['electron'],
    },
    files: [
      './jasmine.shim.js',
      './build/**/*.spec.js',
    ],
    exclude: [
      '**/node_modules/**/*.js',
    ]
  });
};
