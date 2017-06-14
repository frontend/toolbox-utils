const gulp = require('gulp');
const yargs = require('yargs');
const config = require(`${yargs.argv.project}/toolbox.json`);

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

/**
 * Deploy to GH pages
 */
export const deploy = () => {
  return gulp.src(`${yargs.argv.project}/${config.app.ghpages}/**/*`)
    .pipe($.ghPages());
};

export const deployTask = gulp.task('deploy', deploy);
