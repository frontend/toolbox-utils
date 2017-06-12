#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');

const script = process.argv[2];

switch (script) {
  case 'build':
  case 'start':
  case 'deploy':
    const result = spawn(
      './node_modules/.bin/gulp', [script, '--project', process.cwd()], { stdio: 'inherit', cwd: './node_modules/toolbox-utils' },
    );
    break;
  default:
    console.log(`Unknown script "${script}".`);
    break;
}