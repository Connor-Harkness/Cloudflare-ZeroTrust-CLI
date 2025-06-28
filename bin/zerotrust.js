#!/usr/bin/env node
// filepath: /home/connor/Development/Cloudflare-ZeroTrust-CLI/bin/zerotrust.js

const { Command } = require('commander');
const { tunnelCommands } = require('../src/commands/tunnel');
const { version } = require('../package.json');

const program = new Command();

program
  .name('zerotrust')
  .description('Cloudflare ZeroTrust CLI Tool')
  .version(version)
  .option('-t, --token <token>', 'Cloudflare API token')
  .option('-a, --account-id <id>', 'Cloudflare account ID')
  .option('-f, --format <format>', 'Output format (table, json, yaml)', 'table')
  .option('-d, --debug', 'Enable debug output');

// Add tunnel commands
tunnelCommands(program);

program.parse();