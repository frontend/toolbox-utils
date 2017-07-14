/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const PrettierPlugin = require('prettier-webpack-plugin');
const config = require('./tasks/config');

module.exports = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      `${config.project}/${config.src}components/base.js`
    ]
  },
  output: {
    path: `${config.project}/${config.dest}js`,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loaders: 'babel-loader',
        query: {
          presets: ['babel-preset-es2015'],
          plugins: [
            'babel-plugin-transform-es2015-spread',
            'babel-plugin-transform-object-rest-spread'
          ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(`${config.project}/${config.src}components`),
      path.resolve(__dirname, 'node_modules'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: 2,
      filename: 'vendors.bundle.js'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new PrettierPlugin({
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      encoding: 'utf-8',
      extensions: [ ".js", ".ts" ]
    })
  ]
};
