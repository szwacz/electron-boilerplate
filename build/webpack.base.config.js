const path = require("path");
const jetpack = require("fs-jetpack");
const nodeExternals = require("webpack-node-externals");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const translateEnvToMode = (env) => {
  if (env === "production") {
    return "production";
  }
  return "development";
};

const getAllHtmlFilesInSrcDir = () => {
  const srcDir = jetpack.cwd('src');
  return srcDir.find({ matching: '*.html', recursive: false })
    .map(path => path.split('.').slice(0, -1).join('.'));
};

module.exports = env => {
  return {
    target: "electron-renderer",
    mode: translateEnvToMode(env),
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      }
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: (() => {
      const plugins = [
        new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" }),
      ];

      getAllHtmlFilesInSrcDir().map(fileName => 
        plugins.push(
          new HtmlWebpackPlugin({
            filename: `${fileName}.html`,
            template: `src/${fileName}.html`,
            chunks: [ fileName ]
          })
        )
      )
      return plugins;
    })()
  };
};
