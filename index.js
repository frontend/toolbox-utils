#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');
const yargs = require('yargs');

const script = process.argv[2];
const args = process.argv[3] ? '--' + process.argv[3] : process.argv[3];

let env = script === 'build' ? '--production' : '--dev';

const result = spawn(
  './node_modules/.bin/gulp',
  [script, '--project', process.cwd(), env, args],
  { stdio: 'inherit', cwd: './node_modules/toolbox-utils' },
);
