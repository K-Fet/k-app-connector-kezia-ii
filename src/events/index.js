const path = require('path');
const fs = require('fs').promises;
const { toDate } = require('date-fns');
const pool = require('../db-client');
const reader = require('./reader');
const transformer = require('./transformer');
const kAppApi = require('../k-app-api');

const LAST_RUN_PATH = path.join(__dirname, 'last-run.bin');

/**
 * Save the last run timestamp
 * @param time {Date}
 * @returns {Promise<void>}
 */
async function saveLastRun(time) {
  await fs.writeFile(LAST_RUN_PATH, time.toISOString(), { encoding: 'utf8' });
}

/**
 * Load the last run timestamp or return current time.
 *
 * @returns {Promise<Date>}
 */
async function loadLastRun() {
  let content;
  try {
    content = await fs.readFile(LAST_RUN_PATH, { encoding: 'utf8' });
  } catch (e) {
    if (e.code === 'ENOENT') return new Date();
    console.warn('Unable to load last run', e);
    throw e;
  }

  const date = toDate(content);

  if (date !== 'Invalid Date') return date;
  return new Date();
}

async function run() {
  const lastSucceededRun = await loadLastRun();

  const db = await pool.acquire();

  try {
    const data = await reader.read(db, { lastSucceededRun });

    // Save time just after the database request
    const currentTime = new Date();

    // Need K-App here
    await kAppApi.connect();

    const transformedData = await transformer.transform(data);

    console.log(`Got ${transformedData.length} items to send`);

    await kAppApi.sendStockEvents(transformedData);
    kAppApi.disconnect();

    throw new Error();
    await saveLastRun(currentTime);
  } finally {
    // Maybe we should let it fail without crashing the task?
    pool.release(db);
  }
}

module.exports = {
  run,
};
