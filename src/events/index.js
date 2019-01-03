const pool = require('../db-client');
const reader = require('./reader');
const transformer = require('./transformer');
const kAppApi = require('../k-app-api');

async function run({ lastSucceededRun }) {
  const db = await pool.acquire();

  const data = await reader.read(db, { lastSucceededRun });

  // Save time just after the database request
  const currentTime = new Date();

  const transformedData = await transformer.transform(data);

  await kAppApi.sendStockEvents(transformedData);

  // Maybe we should let it fail without crashing the task?
  await pool.release(db);

  return currentTime;
}

module.exports = {
  run,
};
