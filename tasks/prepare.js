const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const config = require('./config');
const fs = require('fs');
const fetch = require('node-fetch');

const rawgit = 'https://rawgit.com/frontend/toolbox-reader/master/build';
const dirs = ['atoms', 'molecules', 'organisms', 'pages'];

const prepare = async (done) => {
  const colors = await fs.readFileSync(`${config.project}/${config.src}config/colors.json`);
  const data = await fs.readFileSync(`${config.project}/${config.src}config/data.json`);

  const components = {};
  const toolboxConfig = await fetch(`${rawgit}/asset-manifest.json`)
    .then(function(res) {
      return res.json();
    });

  dirs.forEach((dir) => {
    let files = fs.readdirSync(`${config.project}/${config.src}components/${dir}`);

   // ignore files
    const ignoreFiles = ['.gitkeep', '.DS_Store'];
    ignoreFiles.forEach((file) => {
      const index = files.indexOf(file);
      if (index > -1) {
        files = [...files.slice(0, index), ...files.slice(index + 1)];
      }
    });

    components[dir] = [];
    files.forEach(file => components[dir].push(file));
  });

  $.util.log('Using template', $.util.colors.magenta(config.custom_template || config.template));

  return gulp.src(config.custom_template || config.template, { cwd: config.custom_template ? config.project : '' })
    .pipe($.cheerio(($, file) => {

      $(`
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twig.js/0.8.9/twig.min.js"></script>\n
        <script type="text/javascript">\n
          window.sources = ${JSON.stringify(components)};\n
          window.data = ${JSON.stringify(data)};\n
          window.colors = ${JSON.stringify(JSON.parse(colors))};\n
        </script>\n
        <link rel="stylesheet" href="css/base.css">\n
        <link rel="stylesheet" href="${rawgit}/${toolboxConfig['main.css']}">\n
      `).appendTo('head');

      if (config.vendors.css) {
        $(`
          <script src="https://cdnjs.cloudflare.com/ajax/libs/twig.js/0.8.9/twig.min.js"></script>\n
          <link rel="stylesheet" href="css/vendors.min.css">\n
        `).appendTo('head');
      }

      if (config.vendors.js) {
        $(`  <script src="js/vendors.min.js"></script>\n`).appendTo('body');
      }

      if (!config.dev) {
        $(`
          <script src="js/vendors.bundle.js"></script>\n
          <script src="js/app.bundle.js"></script>\n
        `).appendTo('body');
      } else {
        $(`
          <script src="vendors.bundle.js"></script>\n
          <script src="app.bundle.js"></script>\n
        `).appendTo('body');
      }

      $(`  <script src="${rawgit}/${toolboxConfig['main.js']}"></script>\n`).appendTo('body');
    }))
    .pipe($.rename('index.html'))
    .pipe(gulp.dest(config.dest, {cwd: config.project}));
}

module.exports = prepare;
