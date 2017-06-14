'use strict';

const gulp = require('gulp');

const del = require('del');
const merge = require('merge-stream');

const styles = require('./tasks/styles');
const scripts = require('./tasks/scripts');
const vendors = require('./tasks/vendors');
const single = require('./tasks/single');
const icons = require('./tasks/icons');

const config = require('./tasks/config');

/**
 * Clean
 *
 * Removes the build directory. Avoids issues with deleted files.
 */
const clean = () => del([config.project + config.dest], {force: true});
gulp.task('clean', clean);

/**
 * Config
 */
const copyPaths = [{
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

/**
 * Copy stuff
 */
const copyAssets = () => {
  return merge(copyPaths.map((item) => {
    return gulp.src(config.src + item.src, {cwd: config.project})
      .pipe(gulp.dest(config.dest + item.dest, {cwd: config.project}));
  }));
};
gulp.task('copy-assets', copyAssets);

/**
 * Gulp Tasks
 */
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    copyAssets,
    vendors,
    single,
    icons,
  ),
));

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('vendors', vendors);
gulp.task('icons', icons);
gulp.task('single', gulp.series(single));

gulp.task('serve', function(done){
  console.log('it works');
  done();
});
