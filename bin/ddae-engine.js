#!/usr/bin/env node

import { run } from '../src/cli.js';

run(process.argv).catch((error) => {
  console.error(`ddae-engine: ${error.message}`);
  process.exitCode = 1;
});
