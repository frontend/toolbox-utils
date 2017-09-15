const gulp = require('gulp');
const webpack = require('webpack');
const webpackSettings = require('../webpack.prod.config');
const errorAlert = require('./helpers');

const config = require('./config');

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

/**
 * Build JS
 * With error reporting on compiling (so that there's no crash)
 * And jshint check to highlight errors as we go.
 */
const scripts = (done) => {
  // run webpack
  webpack(webpackSettings, function(err, stats) {
    if(err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      cached: false,
      colors: true,
    }));
    done();
  });
};

module.exports = scripts;
