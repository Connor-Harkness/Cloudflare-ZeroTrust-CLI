const Cloudflare = require('cloudflare');
const config = require('../config');

class CloudflareClient {
  constructor(options = {}) {
    const credentials = config.getCredentials(options);
    
    if (options.debug) {
      console.log('Debug: Options received:', options);
      console.log('Debug: Credentials resolved:', { 
        token: credentials.token ? '[REDACTED]' : 'undefined',
        accountId: credentials.accountId || 'undefined'
      });
    }
    
    if (!credentials.token) {
      throw new Error('Cloudflare API token is required. Set CLOUDFLARE_API_TOKEN environment variable or use --token flag.');
    }

    if (!credentials.accountId) {
      throw new Error('Cloudflare account ID is required. Set CLOUDFLARE_ACCOUNT_ID environment variable or use --account-id flag.');
    }

    this.accountId = credentials.accountId;
    this.cf = new Cloudflare({
      apiToken: credentials.token
    });

    if (options.debug) {
      console.log('Debug: Initialized Cloudflare client');
    }
  }

  async listTunnels() {
    try {
      const response = await this.cf.zeroTrust.tunnels.list({
        account_id: this.accountId
      });
      return response.result || [];
    } catch (error) {
      throw new Error(`Failed to list tunnels: ${error.message}`);
    }
  }

  async getTunnel(tunnelId) {
    try {
      const response = await this.cf.zeroTrust.tunnels.get(tunnelId, {
        account_id: this.accountId
      });
      return response.result;
    } catch (error) {
      throw new Error(`Failed to get tunnel ${tunnelId}: ${error.message}`);
    }
  }

  async createTunnel(name, tunnelSecret) {
    try {
      const response = await this.cf.zeroTrust.tunnels.create({
        account_id: this.accountId,
        name,
        tunnel_secret: tunnelSecret
      });
      return response.result;
    } catch (error) {
      throw new Error(`Failed to create tunnel: ${error.message}`);
    }
  }

  async deleteTunnel(tunnelId) {
    try {
      const response = await this.cf.zeroTrust.tunnels.delete(tunnelId, {
        account_id: this.accountId
      });
      return response.result;
    } catch (error) {
      throw new Error(`Failed to delete tunnel ${tunnelId}: ${error.message}`);
    }
  }

  async listTunnelRoutes(tunnelId) {
    try {
      const response = await this.cf.zeroTrust.tunnels.routes.list({
        account_id: this.accountId,
        tunnel_id: tunnelId
      });
      return response.result || [];
    } catch (error) {
      throw new Error(`Failed to list tunnel routes: ${error.message}`);
    }
  }
}

module.exports = CloudflareClient;
