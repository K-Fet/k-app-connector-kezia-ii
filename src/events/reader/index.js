async function read(db, { lastSucceededRun }) {
  const query = `
    SELECT * FROM ART_LOCAL
  `.trim();

  const res = await db.queryResult(query);

  console.log(`DB Res for query '${query}':`, res);
}

module.exports = {
  read,
};
