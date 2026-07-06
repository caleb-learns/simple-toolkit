#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
    const args = { dir: '.', pattern: null, replacement: '', dryRun: false };
    for (let i = 0; i < argv.length; i++) {
          const a = argv[i];
          if (a === '--dir') args.dir = argv[++i];
          else if (a === '--pattern') args.pattern = argv[++i];
          else if (a === '--replace') args.replacement = argv[++i];
          else if (a === '--dry-run') args.dryRun = true;
    }
    return args;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.pattern) {
          console.error('Usage: rename --dir <path> --pattern <regex> --replace <text> [--dry-run]');
          process.exit(1);
    }
    const regex = new RegExp(args.pattern);
    const files = fs.readdirSync(args.dir);
    for (const file of files) {
          if (!regex.test(file)) continue;
          const newName = file.replace(regex, args.replacement);
          const from = path.join(args.dir, file);
          const to = path.join(args.dir, newName);
          if (args.dryRun) {
                  console.log(`${file} -> ${newName}`);
          } else {
                  fs.renameSync(from, to);
                  console.log(`Renamed: ${file} -> ${newName}`);
          }
    }
}

main();
