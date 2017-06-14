/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const yargs = require('yargs');
const config = require(`${yargs.argv.project}/toolbox.json`);

module.exports = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      `${yargs.argv.project}/${config.src}components/base.js`
    ],
    vendors: []
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
        loaders: [
          'babel?presets[]=es2015,plugins[]=transform-object-rest-spread,plugins[]=transform-es2015-spread',
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
    extensions: ['', '.js', '.jsx'],
    modules: [
      path.resolve(`${yargs.argv.project}/${config.src}components`),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: 1,
      filename: 'vendors.bundle.js'
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
