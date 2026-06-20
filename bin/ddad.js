#!/usr/bin/env node

import { run } from '../src/cli.js';

run(process.argv).catch((error) => {
  console.error(`ddad: ${error.message}`);
  process.exitCode = 1;
});
