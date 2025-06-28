const { Command } = require('commander');
const CloudflareClient = require('../api/client');
const OutputFormatter = require('../utils/output');
const crypto = require('crypto');

function tunnelCommands(program) {
  const tunnel = new Command('tunnel');
  tunnel.description('Manage Cloudflare ZeroTrust tunnels');

  tunnel
    .command('list')
    .description('List all tunnels')
    .action(async (options, command) => {
      try {
        // Fix: Access global options from the root program
        const globalOpts = command.parent.parent.opts();
        const client = new CloudflareClient(globalOpts);
        const tunnels = await client.listTunnels();
        
        const formattedTunnels = tunnels.map(t => ({
          id: t.id,
          name: t.name,
          status: t.status || 'unknown',
          created: new Date(t.created_at).toLocaleDateString(),
          connections: t.connections?.length || 0
        }));

        const output = OutputFormatter.format(formattedTunnels, globalOpts.format, {
          headers: ['id', 'name', 'status', 'created', 'connections']
        });
        
        console.log(output);
      } catch (error) {
        OutputFormatter.error(error.message);
        process.exit(1);
      }
    });

  tunnel
    .command('show <tunnelId>')
    .description('Show detailed information about a tunnel')
    .action(async (tunnelId, options, command) => {
      try {
        const globalOpts = command.parent.parent.opts();
        const client = new CloudflareClient(globalOpts);
        const tunnelData = await client.getTunnel(tunnelId);
        
        const output = OutputFormatter.format(tunnelData, globalOpts.format);
        console.log(output);
      } catch (error) {
        OutputFormatter.error(error.message);
        process.exit(1);
      }
    });

  tunnel
    .command('create <name>')
    .description('Create a new tunnel')
    .option('-s, --secret <secret>', 'Tunnel secret (will generate if not provided)')
    .action(async (name, options, command) => {
      try {
        const globalOpts = command.parent.parent.opts();
        const client = new CloudflareClient(globalOpts);
        
        const tunnelSecret = options.secret || crypto.randomBytes(32).toString('base64');
        const tunnel = await client.createTunnel(name, tunnelSecret);
        
        OutputFormatter.success(`Created tunnel: ${tunnel.name} (${tunnel.id})`);
        
        if (globalOpts.format !== 'table') {
          const output = OutputFormatter.format(tunnel, globalOpts.format);
          console.log(output);
        }
      } catch (error) {
        OutputFormatter.error(error.message);
        process.exit(1);
      }
    });

  tunnel
    .command('delete <tunnelId>')
    .description('Delete a tunnel')
    .option('-y, --yes', 'Skip confirmation')
    .action(async (tunnelId, options, command) => {
      try {
        const globalOpts = command.parent.parent.opts();
        const client = new CloudflareClient(globalOpts);
        
        if (!options.yes) {
          OutputFormatter.warn(`This will permanently delete tunnel ${tunnelId}`);
          OutputFormatter.info('Use --yes flag to confirm deletion');
          return;
        }
        
        await client.deleteTunnel(tunnelId);
        OutputFormatter.success(`Deleted tunnel: ${tunnelId}`);
      } catch (error) {
        OutputFormatter.error(error.message);
        process.exit(1);
      }
    });

  const hostname = new Command('hostname');
  hostname.description('Manage tunnel hostnames');

  hostname
    .command('list <tunnelId>')
    .description('List hostnames for a tunnel')
    .action(async (tunnelId, options, command) => {
      try {
        const globalOpts = command.parent.parent.parent.opts();
        const client = new CloudflareClient(globalOpts);
        const routes = await client.listTunnelRoutes(tunnelId);
        
        const output = OutputFormatter.format(routes, globalOpts.format);
        console.log(output);
      } catch (error) {
        OutputFormatter.error(error.message);
        process.exit(1);
      }
    });

  tunnel.addCommand(hostname);
  program.addCommand(tunnel);
}

module.exports = { tunnelCommands };
