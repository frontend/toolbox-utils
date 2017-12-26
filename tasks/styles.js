const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const nodeSass = require('node-sass');
const gulpSass = require('gulp-sass');
const log = require('fancy-log');

const config = require('./config');
const {errorAlert} = require('./helpers');

const $ = gulpLoadPlugins();

/**
 * Config
 */
const src = {
  mainScss: `${config.src}components/base.scss`,
  styleguideScss: `${config.src}config/styleguide.scss`,
  scss: `${config.src}components/**/*.scss`,
};

const dest = {
  styles: `${config.dest}/css`,
};

/**
 * Styles
 *
 * Styles are built by pre-processing with Sass and generating sourcemaps.
 * - Autoprefixer is automatically run with PostCSS.See browserslist config
 *   in package.json.
 * - CSSNano minifies the output.
 */
const stylesBuild = () => {
  const source = config.dev || config.styleguide ? [src.mainScss, src.styleguideScss] : src.mainScss;

  gulpSass().compiler = nodeSass;

  return gulp.src(source, {cwd: config.project})
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.sourcemaps.init())
    .pipe(gulpSass.sync().on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.styles, {cwd: config.project}));
};

const stylesLint = () => {
  return gulp.src(src.scss, {cwd: config.project})
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.postcss(
      [
        require('stylelint')(),
        require('postcss-reporter')({
          clearReportedMessages: true,
        }),
      ],
      { syntax: require('postcss-scss') },
    ));
};

const styles = gulp.parallel(stylesLint, stylesBuild);
module.exports = styles;
