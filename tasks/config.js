const argv = require('yargs').argv;
const config = require(`${argv.project}/toolbox.json`);

config.project = argv.project;
config.dev = argv.dev;
config.production = argv.production;
config.styleguide = argv.styleguide;

module.exports = config;
