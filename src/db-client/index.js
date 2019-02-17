const genericPool = require('generic-pool');
const { Database } = require('./odbc-promise');

const factory = {
  create: async () => {
    const db = new Database();
    console.log('Creating new database instance');
    await db.open(process.env.ODBC_CN);
    console.log('New database instance created');
    return db;
  },
  destroy: db => db.close(),
  validate: async (db) => {
    console.log('Testing if connection is ok');
    try {
      await db.query('SELECT * FROM Article');
      console.log('DB Connection is ok');
      return true;
    } catch (e) {
      console.error('DB Connection is failing', e);
      return false;
    }
  },
};

const opts = {
  testOnBorrow: true,
  max: 5, // maximum size of the pool
  min: 1, // minimum size of the pool
};

const pool = genericPool.createPool(factory, opts);

module.exports = pool;
