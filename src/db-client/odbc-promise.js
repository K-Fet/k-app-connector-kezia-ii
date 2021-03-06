const { Database } = require('odbc');
const { promisify } = require('util');

class DatabasePromise extends Database {}

DatabasePromise.prototype.open = promisify(Database.prototype.open);
DatabasePromise.prototype.query = promisify(Database.prototype.query);
DatabasePromise.prototype.queryResult = promisify(Database.prototype.queryResult);
DatabasePromise.prototype.close = promisify(Database.prototype.close);
DatabasePromise.prototype.prepare = promisify(Database.prototype.prepare);
DatabasePromise.prototype.beginTransaction = promisify(Database.prototype.beginTransaction);
DatabasePromise.prototype.commitTransaction = promisify(Database.prototype.commitTransaction);
DatabasePromise.prototype.rollbackTransaction = promisify(Database.prototype.rollbackTransaction);

module.exports = {
  Database: DatabasePromise,
};
