const gulp = require('gulp');
const webpack = require('webpack');
const config = require('./config');
const {pathTo} = require('./helpers');
const webpackSettings = require('../webpack.dev.config');
const browserSync = require('browser-sync').create();
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const styles = require('./styles');
const scripts = require('./scripts');
const icons = require('./icons');

const bundler = webpack(webpackSettings);

/**
 * Hot css injection
 */
const inject = () => {
  return gulp.src([`${config.dest}**/*.css`], {cwd: config.project})
    .pipe(browserSync.stream({match: '**/*.css'}));
};

/**
 * Reload
 */
const reload = (done) => {
  browserSync.reload();
  done();
};

/**
 * useless task
 */
const inprod = done => done();

/**
 * Serve
 */
const serve = () => {
  browserSync.init({
    server: {
      baseDir: [`${config.project}/${config.dest}`],
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: webpackSettings.output.publicPath,
          stats: {
            cached: false,
            colors: true,
          }
        }),
        webpackHotMiddleware(bundler)
      ]
    },
    notify: {
      styles: {
        padding: "5px",
        fontSize: "0.7em",
        top: 'auto',
        bottom: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: "5px",
        backgroundColor: "#ef2678",
      }
    },
    open: false
  });

  gulp.watch([
    `${pathTo(config.src)}**/*.scss`
  ], gulp.series(
    styles
  ));

  gulp.watch([
    `${pathTo(config.dest)}**/*.css`
  ], gulp.series(
    inject
  ));

  gulp.watch([
    `${pathTo(config.src)}img/**/*`,
    `${pathTo(config.src)}svg/**/*.svg`,
    `${pathTo(config.src)}favicons/**/*`,
    `${pathTo(config.src)}fonts/**/*`,
    `${pathTo(config.src)}**/*.{json,md,twig,yml}`,
    pathTo('docs/**/*.md')
  ], gulp.series(
    'copy-assets',
    reload
  ));

  gulp.watch([
    `${pathTo(config.src)}icons/**/*.svg`
  ], gulp.series(
    icons,
    reload
  ));

  gulp.watch([
    `${pathTo(config.src)}**/*.js`
  ], gulp.series(
    scripts
  ));
};

module.exports = serve;
