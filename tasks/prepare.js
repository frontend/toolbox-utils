const { homedir } = require('os');
const gulp = require('gulp');
const axios = require('axios');
const download = require('download');
const log = require('fancy-log');
const $ = require('gulp-load-plugins')();
const config = require('./config');
const fs = require('fs-extra');
const dirTree = require('./helpers').dirTree;
const fetch = require('node-fetch');
const yaml = require('yamljs');
const pkg = require('./../package.json');

const cssBundles = config.bundles !== undefined && config.bundles.scss !== undefined;
const jsBundles = config.bundles !== undefined && config.bundles.js !== undefined;

const prepare = async (done) => {
  // Check if user is online
  const isOnline = await axios
    .get('https://google.com', { timeout: 3000 })
    .then(res => true)
    .catch(err => false);

  // Define cdn path
  const localCdn = `${homedir()}/.toolbox`;
  let cdn;
  if (config.reader_path) {
    cdn = config.reader_path;
  } else {
    if (isOnline) {
      cdn = await axios
        .get('https://cdn.jsdelivr.net/gh/frontend/toolbox-reader/package.json')
        .then(res => {
          const minor = res.data.version.split('.').splice(0, 2).join('.');
          return `https://cdn.jsdelivr.net/gh/frontend/toolbox-reader@${minor}/build/static`;
        })
        .catch(err => log.error(err));

      // Download Toolbox Reader bundles for future offline usage
      download(`${cdn}/css/main.css`, `${localCdn}/`);
      download(`${cdn}/js/main.js`, `${localCdn}/`);
    } else {
      // Retrieve local Toolbox Reader bundles
      cdn = 'toolbox';
      fs.pathExists(`${localCdn}/main.css`, (err, exists) => {
        if (err || !exists) log.error('You don\'t have any local Toolbox Reader bundles to use... Please connecte yourlsef before retrying.')
        const copyToDir = `${config.project}/${config.dest}toolbox`;
        fs.ensureDirSync(copyToDir)
        fs.copy(`${localCdn}/main.css`, `${copyToDir}/main.css`);
        fs.copy(`${localCdn}/main.js`, `${copyToDir}/main.js`);
      })
    }
  }

  // Get local colors and data
  const colors = await fs.readJsonSync(`${config.project}/${config.src}config/colors.json`);
  const data = await fs.readJsonSync(`${config.project}/${config.src}config/data.json`);

  // Set components types from components/ directory structure
  const types = await dirTree(`${config.project}/${config.src}components`);
  const dirs = types.map(type => Object.keys(type)[0]);

  const components = {};
  const ignoreFiles = ['.gitkeep', '.DS_Store', 'index.md'];

  // Create component collection object
  dirs.forEach((dir) => {
    let files = null;
    try {
      files = fs.readdirSync(`${config.project}/${config.src}components/${dir}`);
    } catch (error) {
      return;
    }

    // ignore files
    ignoreFiles.forEach((file) => {
      const index = files.indexOf(file);
      if (index > -1) {
        files = [...files.slice(0, index), ...files.slice(index + 1)];
      }
    });

    const collection = files.map((file) => {
      const filePath = `${config.project}/${config.src}components/${dir}/${file}/${file}.yml`;
      return yaml.load(filePath);
    });

    components[dir] = [];
    components[dir].push(...collection);
  });

  // Get doc files
  let docFiles = {};
  const summaryPath = `${config.project}/docs/summary.yml`;
  if (fs.pathExistsSync(summaryPath)) {
    docFiles = yaml.load(summaryPath);
  } else {
    docFiles = await dirTree(`${config.project}/docs`);
  }

  log.info(`Using template ${config.template}`);

  return gulp.src(config.template, { cwd: config.base_template ? '' : config.project })
    .pipe($.cheerio(($, file) => {

      $(`
        <script type="text/javascript">
          window.sources = ${JSON.stringify(components)};
          window.docs = ${JSON.stringify(docFiles)};
          window.data = ${JSON.stringify(data)};
          window.colors = ${JSON.stringify(colors)};
          window.version = "${config.version}";
          window.builder = "${pkg.version}";
          ${ config.theme ? `window.theme = ${JSON.stringify(config.theme)};` : '' }
        </script>
        <link rel="stylesheet" href="${cdn}${isOnline ? '/css' : ''}/main.css">
        ${config.vendors.css ? '<link rel="stylesheet" href="css/vendors.min.css">' : ''}
        ${ cssBundles
          ? config.bundles.scss
            .map(b =>  `<link rel="stylesheet" href="css/${b.name}.css">`)
            .join('\n')
          : '<link rel="stylesheet" href="css/base.css">'
        }
        <link rel="stylesheet" href="css/styleguide.css">
      `).appendTo('head');

      if (config.vendors.js) {
        $(`  <script src="js/vendors.min.js"></script>\n`).appendTo('body');
      }

      if (config.dev) {
        $('<script src="app.bundle.js"></script>').appendTo('body');
      } else {
        $(`
          <script src="js/vendors.bundle.js"></script>
          ${ jsBundles
            ? config.bundles.js
              .map(b =>  `<script src="js/${b.name}.bundle.js"></script>`)
              .join('\n')
            : '<script src="js/app.bundle.js"></script>'
          }
        `).appendTo('body');
      }

      $(`  <script src="${cdn}${isOnline ? '/js' : ''}/main.js"></script>\n`).appendTo('body');
    }))
    .pipe($.rename('index.html'))
    .pipe(gulp.dest(config.dest, {cwd: config.project}));
}

module.exports = prepare;
