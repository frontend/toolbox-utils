const gulp = require('gulp');
const config = require('./config');

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

/*
* CSS Vendors
*/
const cssVendors = (done) => {
  if (config.vendors.css.length > 0) {
    return gulp.src(config.vendors.css, {cwd: config.project})
      .pipe($.concat('vendors.min.css'))
      .pipe($.cssnano())
      .pipe($.size({title: 'CSS VENDORS', showFiles: true}))
      .pipe(gulp.dest(`${config.dest}css`, {cwd: config.project}));
  }
  return done();
};

/*
* JS Vendors
*/
const jsVendors = (done) => {
  if (config.vendors.js.length > 0) {
    return gulp.src(config.vendors.js, {cwd: config.project})
      .pipe($.concat('vendors.min.js'))
      .pipe($.size({title: 'JS VENDORS', showFiles: true}))
      .pipe(gulp.dest(`${config.dest}js`, {cwd: config.project}));
  }
  return done();
};

/*
* Fonts Sources
*/
const fontsVendors = () => {
  return gulp.src(config.fonts, {cwd: config.project})
    .pipe($.size({title: 'FONTS'}))
    .pipe(gulp.dest(`${config.dest}fonts`, {cwd: config.project}));
};

const vendors = gulp.parallel(cssVendors, jsVendors, fontsVendors);

module.exports = vendors;
