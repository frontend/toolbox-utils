const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const config = require('../toolbox.json');
const errorAlert = require('./helpers');

const $ = gulpLoadPlugins();

/**
 * Config
 */
const src = {
  mainScss: `${config.src}components/base.scss`,
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
export const styles = () => {
  return gulp.src(src.mainScss)
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync().on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(dest.styles));
};

export const stylesLint = () => {
  return gulp.src(src.scss)
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

export default styles;
