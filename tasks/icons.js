const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const config = require('./config');
const errorAlert = require('./helpers');

const $ = gulpLoadPlugins();

const icons = () => {
  return gulp.src(`${config.src}icons/**/*.svg`, {cwd: config.project})
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.rename({
      prefix: config.iconsFontName + '-'
    }))
    .pipe($.svgo())
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.cheerio(function ($) {
      $('svg').attr('style', 'display:none');
    }))
    .pipe(gulp.dest(`${config.dest}icons`, {cwd: config.project}));
};

module.exports = icons;
