
var path = require('path')
var webpack = require('webpack')

module.exports = {
  target: 'atom',
  entry: {
    app: './app/app.js'
  },
  output: {
    path: './build',
    filename: '[name].js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      // Automtically detect jQuery and $ as free var in modules and inject the jquery library. 
      // Requiring jQuery directly does funny things in Electron.
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    })
  ],
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
    ]
  }
}