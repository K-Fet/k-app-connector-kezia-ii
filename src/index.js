const Runner = require('./runner');

class KeziaIIConnector {
  constructor(options) {
    this.options = {
      ...options,
    };
  }

  init() {
    // TODO:
    //  - Database Init
    //  - API Init (credentials)
    //  - Runner configuration
    this.runner = new Runner(this.options.runner);
  }

  run() {
    this.runner.run();
  }
}

module.exports = KeziaIIConnector;
