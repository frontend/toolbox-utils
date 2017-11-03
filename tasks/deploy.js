const gulp = require('gulp');
const config = require(`./config`);

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

/**
 * Deploy to GH pages
 */
const deploy = () => {
  return gulp.src(`${config.ghpages}/**/*`, { cwd: config.project })
    .pipe($.ghPages({
      remoteUrl: config.remote,
    }));
};

module.exports = deploy;
