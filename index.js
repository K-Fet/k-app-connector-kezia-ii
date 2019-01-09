require('dotenv').config();
const { KeziaIIConnector } = require('./src');

const PULL_MINUTES_INTERVAL = +process.env.PULL_MINUTES_INTERVAL || 10;

const connector = new KeziaIIConnector({
  runner: {
    interval: PULL_MINUTES_INTERVAL * 60 * 1000,
  },
});

connector.init();

connector.start();


const _exitFn = () => {
  console.log('Stopping app');
  return connector.stop();
};
process.on('beforeExit', _exitFn);
process.on('exit', _exitFn);
process.on('SIGINT', _exitFn);
process.on('SIGTERM', _exitFn);
