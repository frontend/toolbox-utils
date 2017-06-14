#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');

const script = process.argv[2];

let args = '';
if (script === 'build') {
  args = '--production';
}

const result = spawn(
  './node_modules/.bin/gulp', [script, '--project', process.cwd(), args], { stdio: 'inherit', cwd: './node_modules/toolbox-utils' },
);