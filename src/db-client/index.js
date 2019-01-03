const genericPool = require('generic-pool');
const { Database } = require('./odbc-promise');

const factory = {
  create: () => new Promise((resolve, reject) => {
    const db = new Database();

    db.open(process.env.ODBC_CN)
      .then(() => resolve(db))
      .catch(reject);
  }),
  destroy: (db) => {
    db.close();
  },
};

const opts = {
  max: 10, // maximum size of the pool
  min: 2, // minimum size of the pool
};

const pool = genericPool.createPool(factory, opts);

module.exports = pool;
