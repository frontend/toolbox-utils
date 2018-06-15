const gulp = require('gulp');
const webpack = require('webpack');
const webpackSettings = require('../webpack.prod.config');
const errorAlert = require('./helpers');

const config = require('./config');

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

// Get javascript bundle config, format and assign it to Webpack entry
const hasBundleConfig = config.bundles !== undefined && config.bundles.js !== undefined;
const JSBundle = hasBundleConfig ? config.bundles.js.reduce((acc, val) => {
  acc[val.name] = `${config.project}/${config.src}${val.src}`;
  return acc;
}, {}) : null;
webpackSettings.entry = JSBundle || webpackSettings.entry;

/**
 * Build JS
 * With error reporting on compiling (so that there's no crash)
 * And jshint check to highlight errors as we go.
 */
const scripts = (done) => {
  // run webpack
  if (config.production) {
    webpack(webpackSettings, function(err, stats) {
      if(err) throw new $.util.PluginError('webpack', err);
      $.util.log('[webpack]', stats.toString({
        cached: false,
        colors: true,
      }));
      done();
    });
  } else { done(); }
};

module.exports = scripts;
