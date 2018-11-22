const { Pool } = require('./odbc-promise');

const pool = new Pool();

function instance(cn) {
  return pool.open(cn || process.env.OCDB_CN);
}


module.exports = {
  instance,
};
