const gulp = require('gulp');
const yargs = require('yargs');
const merge = require('merge-stream');

const config = require('./config');

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

/**
 * Deploy to GH pages
 */
const single = (done) => {
  // Return if singles are empty
  if (!config.singles || !config.singles[Object.keys(config.singles)[0]].src) return done();

  return merge(config.singles.map((item) => {
    return gulp.src(item.src, {cwd: config.project})
      .pipe(gulp.dest(item.dest, {cwd: config.project}));
  }));
};

module.exports = single;
