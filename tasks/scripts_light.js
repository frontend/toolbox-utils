const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const yargs = require('yargs');
const config = require(`${yargs.argv.project}/toolbox.json`);
const errorAlert = require('./helpers');

const $ = gulpLoadPlugins();

/**
 * Config
 */
const src = {
  base: `${config.src}components/base.js`,
  scripts: `${config.src}components/**/*.js`,
};

const dest = {
  scripts: `${config.dest}/js`,
};

/**
 * Scripts
 */
const scripts = () => {
  return gulp.src(src.base, {cwd: yargs.argv.project})
    .pipe($.sourcemaps.init())
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.babel({sourceRoot: yargs.argv.project}))
    .pipe($.concat('bundle.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.scripts, {cwd: yargs.argv.project}));
};
module.exports.scripts = scripts;

const scriptsLint = () => {
  return gulp.src(src.scripts, {cwd: yargs.argv.project})
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.eslint())
    .pipe($.eslint.format());
};
module.exports.scriptsLint = scriptsLint;
