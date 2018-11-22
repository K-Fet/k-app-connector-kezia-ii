const { instance } = require('../db-client');
const reader = require('./reader');
const transformer = require('./transformer');
const kAppApi = require('../k-app-api');

async function run({ lastSucceededRun }) {
  const db = await instance();

  const data = await reader.read(db, { lastSucceededRun });

  // Save time just after the database request
  const currentTime = new Date();

  const transformedData = await transformer.transform(data);

  const res = await kAppApi.sendStockEvents(transformedData);

  // If res.ok check

  await db.close();

  return currentTime;
}

module.exports = {
  run,
};
