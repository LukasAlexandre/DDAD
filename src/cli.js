import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { initCommand } from './commands/init.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

const HELP = `ddad — Document-Driven AI Development

Usage:
  ddad <command> [options]

Commands:
  init              Scaffold the ddad/ docs structure and AI agent rule files in the current project

Options:
  -h, --help        Show this help message
  -v, --version     Print the installed ddad version

Init options:
  --dir <path>      Target directory to scaffold into (default: current directory)
  --force           Overwrite files that already exist

Examples:
  npx ddad init
  npx ddad init --dir ./my-project --force
`;

function parseInitArgs(args) {
  const options = { dir: process.cwd(), force: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--force') {
      options.force = true;
    } else if (arg === '--dir') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('--dir requires a path argument');
      }
      options.dir = path.resolve(value);
      i += 1;
    } else {
      throw new Error(`Unknown option for init: ${arg}`);
    }
  }
  return options;
}

export async function run(argv) {
  const args = argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      await initCommand(parseInitArgs(args.slice(1)));
      break;
    case '-v':
    case '--version':
      console.log(pkg.version);
      break;
    case '-h':
    case '--help':
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}
