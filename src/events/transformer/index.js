const stringSimilarity = require('string-similarity');
const kAppApi = require('../../k-app-api');

const MATCH_THRESHOLD = 0.5;

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
  // Find the best match for product name
  const normalizedName = normalizeName(name);
  const productsName = products
    .map(p => p.name)
    .map(normalizeName);

  const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(normalizedName, productsName);

  // Stop if really different
  if (bestMatch.rating < MATCH_THRESHOLD) {
    console.warn(`Could not find K-App product for ${name}`);
    return null;
  }

  // Find related product id
  return products[bestMatchIndex]._id;
}


/**
 * Transform KeziaII data into K-App compatible data.
 *
 * @param data {any[]}
 * @returns {Promise<any[]>}
 */
async function transform(data) {
  const products = await kAppApi.getAllProducts();

  return data.map(({ DATE, IDART, DEF, Q_VAR }) => ({
    product: getCorrespondingProduct(DEF, products),
    diff: Q_VAR,
    type: 'Transaction',
    date: DATE,
    meta: `IDART:${IDART}`,
  })).filter(e => !!e.product);
}


module.exports = {
  transform,
};
