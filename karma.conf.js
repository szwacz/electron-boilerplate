module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Electron'],
    preprocessors: {
      './build/**/*.spec.js': ['electron', 'jasmine']
    },
    files: [
      { pattern: "./build/**/*.spec.js", watched: true, included: true, served: true }
    ]
  });
};
