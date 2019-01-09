const Runner = require('./runner');
const events = require('./events');
const pool = require('./db-client');

class KeziaIIConnector {
  constructor(options) {
    this.options = {
      ...options,
    };
  }

  init() {
    const missingEnv = [
      'ODBC_CN',
      'K_APP_URL',
      'K_APP_AUTH_TOKEN',
    ].filter(envName => !process.env[envName]).join(',');

    if (missingEnv) {
      console.error(`Following environment variables are missing: ${missingEnv}`);
      process.exit(1);
      return;
    }

    const tasks = [];

    tasks.push({
      name: 'events',
      async handler(options, data) {
        await events.run(data);
      },
    });

    this.runner = new Runner({
      ...this.options.runner,
      tasks,
    });
  }

  start() {
    this.runner.startAll();
  }

  stop() {
    this.runner.stopAll();
    // Force clear pool
    pool.drain().then(() => pool.clear());
  }
}

module.exports = {
  KeziaIIConnector,
};
