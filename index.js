const { Database } = require('./src/db-client/odbc-promise');

const db = new Database();

async function main() {
  await db.open('DSN=caisse;Uid=Admin;Pwd=;');

  console.log('Connected:');
  //
  // const insert = await db.query("INSERT INTO Famille VALUES (2, 'Some random family', 5, 1)");
  // console.log('INSERT: ', insert);

  const res = db.querySync('SELECT IDFAM, FAMILLE, IDRAY, MAJ FROM Famille');

  console.log('DEBUG:', res);
}

main()
  .catch(err => console.error('Error in script', err))
  .then(() => process.exit(0));

//module.exports = require('./src');
