const yargs = require('yargs');
const config = require(`${yargs.argv.project}/toolbox.json`);

config.project = yargs.argv.project;

module.exports = config;
