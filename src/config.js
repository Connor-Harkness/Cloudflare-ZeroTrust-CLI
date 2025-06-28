const fs = require('fs');
const path = require('path');
const os = require('os');

class Config {
  constructor() {
    this.configDir = path.join(os.homedir(), '.zerotrust');
    this.configFile = path.join(this.configDir, 'config.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Warning: Could not load config file');
    }
    return {};
  }

  saveConfig() {
    try {
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error.message);
    }
  }

  get(key, defaultValue = null) {
    return this.config[key] || defaultValue;
  }

  set(key, value) {
    this.config[key] = value;
    this.saveConfig();
  }

  getCredentials(options) {
    return {
      token: options.token || process.env.CLOUDFLARE_API_TOKEN || this.get('token'),
      accountId: options.accountId || process.env.CLOUDFLARE_ACCOUNT_ID || this.get('accountId')
    };
  }
}

module.exports = new Config();
