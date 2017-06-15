/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const config = require('./tasks/config');

const localModule = (name) => path.resolve(__dirname, `node_modules/${name}`);

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
        loaders: [
          `babel-loader?presets[]=${localModule('babel-preset-es2015')},plugins[]=${localModule('babel-plugin-transform-object-rest-spread')},plugins[]=${localModule('babel-plugin-transform-es2015-spread')}`,
          'webpack-module-hot-accept'
        ]
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
      path.resolve(__dirname, 'node_modules')
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: 1,
      filename: 'vendors.bundle.js'
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
