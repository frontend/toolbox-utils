const argv = require('yargs').argv;
const fs = require('fs');
const config = require(`${argv.project}/toolbox.json`);
const packageJson = require(`${argv.project}/package.json`);

config.template = `${argv.project}/toolbox-index.html`;
try {
  fs.accessSync(config.template);
} catch (e) {
  config.template = './templates/index.html';
  config.base_template = true;
}

config.project = argv.project;
config.dev = argv.dev;
config.production = argv.production;
config.styleguide = argv.styleguide;
config.version = packageJson.version;

module.exports = config;
