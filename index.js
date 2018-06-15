#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');
const yargs = require('yargs');

const chalk = require('chalk');
const latestVersion = require('latest-version');
const pkg = require('./package.json');

// Display update notification if it's not the last version
latestVersion('toolbox-utils').then(version => {
	if (version !== pkg.version) {
    const msg = ` Version ${version} (current ${pkg.version}) of toolbox-utils is available ! `;
    console.log(`
${chalk.white.bgRed.bold(` ${' '.repeat(msg.length)} \n ${msg} \n${' '.repeat(msg.length)}  `)}

To update your beloved builder, do :
$ ${chalk.green('yarn upgrade toolbox-utils')} (recommended)
or
$ ${chalk.green('npm update toolbox-utils')}
    `);
  }
});

const script = process.argv[2];
const args = process.argv[3] ? '--' + process.argv[3] : process.argv[3];

let env = script === 'build' ? '--production' : '--dev';

const result = spawn(
  './node_modules/.bin/gulp',
  [script, '--project', process.cwd(), env, args],
  { stdio: 'inherit', cwd: './node_modules/toolbox-utils' },
);
