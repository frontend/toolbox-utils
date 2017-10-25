const gulp = require('gulp');

const yargs = require('yargs');
const config = require(`${yargs.argv.project}/toolbox.json`);

const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();

const name = config.iconName;

/*
 * Build icons font and stylesheets
 */
const icons = () => {
  return gulp.src(`${yargs.argv.project}/${config.src}icons/**/*.svg`)
    .pipe($.iconfont({
      fontName: name,
      appendCodepoints: true,
      normalize: true,
      fontHeight: 1001,
    }))
    .on('glyphs', (glyphs) => {
      gulp.src('templates/_icons.scss')
        .pipe($.consolidate('lodash', {
          glyphs: glyphs.map((glyph) => {
            return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) };
          }),
          fontName: name,
          fontPath: '../fonts/',
          className: name,
        }))
        .pipe($.rename(`${name}.scss`))
        .pipe(gulp.dest(`${yargs.argv.project}/${config.src}fonts`));
    })
    .pipe(gulp.dest(`${yargs.argv.project}/${config.dest}fonts`));
};

module.exports = icons;
