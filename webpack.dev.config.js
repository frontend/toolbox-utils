/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const config = require('./tasks/config');

module.exports = {
  mode: 'development',
  entry: {
    app: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
    ]
  },
  output: {
    path: `${config.project}/${config.dest}js`,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json'
        }
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
    new webpack.HotModuleReplacementPlugin()
  ]
};
