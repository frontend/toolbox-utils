/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const config = require('./tasks/config');

module.exports = {
  mode: 'production',
  entry: {
    app: `${config.project}/${config.src}components/base.js`
  },
  output: {
    path: `${config.project}/${config.dest}js`,
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
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
  resolveLoader: {
    modules: ['node_modules'],
  },
  plugins: [
    // ensure that we get a production build of any dependencies
    // this is primarily for React, where this removes 179KB from the bundle
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    })
  ]
};
