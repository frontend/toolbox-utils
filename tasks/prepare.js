const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const config = require('./config');
const fs = require('fs');
const fetch = require('node-fetch');
const yargs = require('yargs');

const rawgit = 'https://rawgit.com/frontend/toolbox-reader/master/build';
const dirs = ['atoms', 'molecules', 'organisms', 'pages'];

const prepare = async (done) => {
  const colors = await fs.readFileSync(`${config.project}/${config.src}config/colors.json`);
  const data = await fs.readFileSync(`${config.project}/${config.src}config/data.json`);

  const components = [];
  const toolboxConfig = await fetch(`${rawgit}/asset-manifest.json`)
    .then(function(res) {
      return res.json();
    });

  dirs.forEach((dir) => {
    let files = fs.readdirSync(`${config.project}/${config.src}components/${dir}`);

    // ignore .gitkeep
    const gitKeepIndex = files.indexOf('.gitkeep');
    if (gitKeepIndex > -1) {
      files = [...files.slice(0, gitKeepIndex), ...files.slice(gitKeepIndex + 1)];
    }

    files.forEach(file => components.push(`./components/${dir}/${file}`));
  });

  return gulp.src('./templates/index.html')
    .pipe($.replace('[/* SOURCES */]', JSON.stringify(components)))
    .pipe($.replace('{/* DATA */}', JSON.stringify(JSON.parse(data))))
    .pipe($.replace('{/* COLORS */}', JSON.stringify(JSON.parse(colors))))
    .pipe($.cheerio(($, file) => {
      $(`  <link rel="stylesheet" href="${rawgit}/${toolboxConfig['main.css']}">\n`).appendTo('head');

      if (!yargs.argv.dev) {
        $(`  <script src="../js/vendors.bundle.js"></script>\n`).appendTo('body');
        $(`  <script src="../js/app.bundle.js"></script>\n`).appendTo('body');
      } else {
        $(`  <script src="vendors.bundle.js"></script>\n`).appendTo('body');
        $(`  <script src="app.bundle.js"></script>\n`).appendTo('body');
      }

      $(`  <script src="${rawgit}/${toolboxConfig['main.js']}"></script>\n`).appendTo('body');
    }))
    .pipe(gulp.dest(config.dest, {cwd: config.project}));
}

module.exports = prepare;
