const argv = require('yargs').argv;
const fs = require('fs');
const config = require(`${argv.project}/toolbox.json`);


config.template = './templates/index.html';
config.custom_template = `${argv.project}/toolbox-index.html`;
try {
  fs.accessSync(config.custom_template);
} catch (e) {
  config.custom_template = null;
}

config.project = argv.project;
config.dev = argv.dev;
config.production = argv.production;
config.styleguide = argv.styleguide;

module.exports = config;
