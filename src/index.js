const Runner = require('./runner');
const events = require('./events');

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
        // eslint-disable-next-line no-param-reassign
        data.lastSucceededRun = await events.run(data);
      },
      data: {
        // TODO Load from last run
        lastSucceededRun: new Date(0),
      },
    });

    this.runner = new Runner({
      ...this.options.runner,
      tasks,
    });
  }

  run() {
    this.runner.run();
  }
}

module.exports = {
  KeziaIIConnector,
};
