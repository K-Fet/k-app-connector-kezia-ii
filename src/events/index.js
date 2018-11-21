const db = require('../db-client');
const reader = require('./reader');

async function run({ lastSucceededRun }) {
  const data = await reader.read(db, { lastSucceededRun });
}

module.exports = {
  run,
};
