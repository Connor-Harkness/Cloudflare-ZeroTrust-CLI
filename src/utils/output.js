const { table } = require('table');
const chalk = require('chalk');
const yaml = require('js-yaml');

class OutputFormatter {
  static format(data, format = 'table', options = {}) {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'yaml':
        return yaml.dump(data);
      case 'table':
      default:
        return this.formatTable(data, options);
    }
  }

  static formatTable(data, options = {}) {
    if (!Array.isArray(data) || data.length === 0) {
      return 'No data to display';
    }

    const headers = options.headers || Object.keys(data[0]);
    const tableData = [
      headers.map(h => chalk.bold(h)),
      ...data.map(item => headers.map(header => {
        const value = item[header];
        return value !== undefined ? String(value) : '';
      }))
    ];

    return table(tableData, {
      border: {
        topBody: '─',
        topJoin: '┬',
        topLeft: '┌',
        topRight: '┐',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '└',
        bottomRight: '┘',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '─',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: '┼'
      }
    });
  }

  static success(message) {
    console.log(chalk.green('✓'), message);
  }

  static error(message) {
    console.error(chalk.red('✗'), message);
  }

  static info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  static warn(message) {
    console.warn(chalk.yellow('⚠'), message);
  }
}

module.exports = OutputFormatter;
