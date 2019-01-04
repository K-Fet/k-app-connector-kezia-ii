const kAppApi = require('../../k-app-api');

function normalizeName(name) {
  return name
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Find the corresponding K-App product id
 *
 * @param name {string} KeziaII article name
 * @param products {any[]} K-App products
 * @return {string|null} Matching product or null
 */
function getCorrespondingProduct(name, products) {
  let id;

  const normalizedName = normalizeName(name);
  const productsName = products
    .map(p => p.name)
    .map(normalizeName);

  if (!id) {
    console.warn(`Could not find K-App product for ${name}`);
    return null;
  }
  return id;
}


/**
 * Transform KeziaII data into K-App compatible data.
 *
 * @param data {any[]}
 * @returns {Promise<any[]>}
 */
async function transform(data) {
  const products = await kAppApi.getAllProducts();

  return data.map((d) => {
    const {
      DATE, IDART, DEF, Q_VAR,
    } = d;

    const product = getCorrespondingProduct(DEF, products);

    return {
      product,
      diff: Q_VAR,
      type: 'Transaction',
      date: DATE,
      meta: `IDART:${IDART}`,
    };
  }).filter(e => !!e.product);
}


module.exports = {
  transform,
};
