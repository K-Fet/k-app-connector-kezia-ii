const stringSimilarity = require('string-similarity');
const { parse } = require('date-fns');
const kAppApi = require('../../k-app-api');

const MATCH_THRESHOLD = +process.env.PRODUCTS_MATCH_THRESHOLD || 0.5;
const DATE_FORMAT = 'yyyy-MM dd:HH:mm::0ss';

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
  if (!products.length) return null;

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
    date: parse(DATE.slice(3), DATE_FORMAT, new Date()),
    meta: `IDART:${IDART}`,
  })).filter(e => !!e.product);
}


module.exports = {
  transform,
};
