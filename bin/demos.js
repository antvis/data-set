#!/usr/bin/env node
const shelljs = require('shelljs');

shelljs.exec('$(npm bin)/electron ./bin/electron/demos.js');
