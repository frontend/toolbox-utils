/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const yargs = require('yargs');
const config = require(`${yargs.argv.project}/toolbox.json`);

const localModule = (name) => path.resolve(__dirname, `node_modules/${name}`);

module.exports = {
  entry: {
    app: `${yargs.argv.project}/${config.src}components/base.js`
  },
  output: {
    path: `${yargs.argv.project}/${config.dest}js`,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loaders: 'babel-loader',
        query: {
          presets: [localModule('babel-preset-es2015')],
          plugins: [
            localModule('babel-plugin-transform-es2015-spread'), 
            localModule('babel-plugin-transform-object-rest-spread')]
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
      path.resolve(`${yargs.argv.project}/${config.src}components`),
      path.resolve(__dirname, 'node_modules')
    ]
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: 2,
      filename: 'vendors.bundle.js'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
