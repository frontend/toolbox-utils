'use strict';

const gulp = require('gulp');

const del = require('del');
const merge = require('merge-stream');
const yargs = require('yargs');

const styles = require('./tasks/styles');
const scripts = require('./tasks/scripts');
const vendors = require('./tasks/vendors');
const single = require('./tasks/single');
const icons = require('./tasks/icons');
const serve = require('./tasks/serve');
const prepare = require('./tasks/prepare');

const config = require('./tasks/config');

/**
 * Clean
 *
 * Removes the build directory. Avoids issues with deleted files.
 */
const clean = () => del([`${config.project}/${config.dest}`], {force: true});

/**
 * Config
 */
let copyPaths = [{
  src: 'images/**/*',
  dest: '/images',
}, {
  src: 'svg/**/*.svg',
  dest: '/svg',
}, {
  src: 'favicons/**/*',
  dest: '/favicons',
}, {
  src: 'fonts/**/*',
  dest: '/fonts',
}];

const copyPathsDev = [{
  src: 'components/**/!(*.scss)',
  dest: '/components',
}];

/**
 * Copy stuff
 */
const copyAssets = () => {
  if (yargs.argv.dev || yargs.argv.styleguide) {
    copyPaths.push(...copyPathsDev);
  }

  return merge(copyPaths.map((item) => {
    return gulp.src(config.src + item.src, {cwd: config.project})
      .pipe(gulp.dest(config.dest + item.dest, {cwd: config.project}));
  }));
};

/**
 * Prepare styleguide if needed
 */
const prepareStyleguide = (done) => {
  if (yargs.argv.dev || yargs.argv.styleguide) {
    prepare();
  }
  done();
}

/**
 * Gulp Tasks
 */
const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    copyAssets,
    vendors,
    single,
    icons,
    prepareStyleguide
  )
);

gulp.task('serve', gulp.series(build, serve));
gulp.task('prepare', gulp.series(prepare));
gulp.task('build', build);
gulp.task('clean', clean);
gulp.task('copy-assets', copyAssets);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('vendors', vendors);
gulp.task('icons', icons);
gulp.task('single', gulp.series(single));
gulp.task('default', build);
