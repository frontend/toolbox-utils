#!/usr/bin/env node

'use strict';

const child = require('child_process');;

const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
  case 'build':
  case 'start':
  case 'deploy':
    const result = child.spawn(
      './node_modules/.bin/gulp', [script, args], { stdio: 'inherit' },
    );
    process.exit(result.status);
    break;
  default:
    console.log(`Unknown script "${script}".`);
    break;
}