const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const autoprefixer = require('autoprefixer');

const config = require('./config');
const {errorAlert} = require('./helpers');

const $ = gulpLoadPlugins();

const hasBundleConfig = config.bundles !== undefined && config.bundles.scss !== undefined;
const ScssBundle = hasBundleConfig ? config.bundles.scss.map((item) => {
  return `${config.project}/${config.src}${item.src}`;
}) : null;
const ScssNames = hasBundleConfig ? config.bundles.scss.map(item => item.name) : null;

/**
 * Config
 */
const src = {
  mainScss: hasBundleConfig ? ScssBundle : [`${config.src}components/base.scss`],
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
  const source = config.dev || config.styleguide ? [...src.mainScss, src.styleguideScss] : src.mainScss;
  let i = 0;

  return gulp.src(source, {cwd: config.project})
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync().on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({ grid: true }),
      require('cssnano'),
    ]))
    .pipe($.rename((path) => {
      if (ScssNames[i]) path.basename= ScssNames[i];
      i += 1;
    }))
    .pipe(config.production ? $.util.noop() : $.sourcemaps.write('./'))
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
