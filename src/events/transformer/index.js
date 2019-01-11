const stringSimilarity = require('string-similarity');
const { parse } = require('date-fns');
const kAppApi = require('../../k-app-api');

const MATCH_THRESHOLD = +process.env.PRODUCTS_MATCH_THRESHOLD || 0.5;
const DATE_FORMAT = 'yyyy-MM dd:HH:mm:sss';

function normalizeName(name) {
  return name
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Create an mapping object between Kezia articles and K-App products
 *
 * @param data {any[]} Read data
 * @param products {any[]} K-App products
 * @return {any} A map matching Kezia articles and K-App products
 */
function createProductMap(data, products) {
  if (!products.length || !data.length) return null;

  const articles = data.reduce((acc, { IDART, DEF }) => ({ ...acc, [IDART]: normalizeName(DEF) }), {});
  const remainingProducts = [...products.map(p => p.name).map(normalizeName)];

  return Object
    .entries(articles)
    .map(([idart, def]) => {
      const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(def, remainingProducts);

      // Stop if really different
      if (bestMatch.rating < MATCH_THRESHOLD) {
        console.warn(`Could not find K-App product for ${def}`);
        return null;
      }
      const [product] = remainingProducts.slice(bestMatchIndex, 1);
      return product;
    })
    .reduce((acc, {}) => {});
}

/**
 * Transform a HyperFile date to a js date.
 *
 * @param DATE
 * @return {never}
 */
function getDate(DATE) {
  if (!DATE) return null;
  return parse(DATE.substring(4).replace('.', ':'), DATE_FORMAT, new Date());
}

/**
 * Transform KeziaII data into K-App compatible data.
 *
 * @param data {any[]}
 * @returns {Promise<any[]>}
 */
async function transform(data) {
  const products = await kAppApi.getAllProducts();

  const productMap = createProductMap(data, products);

  return data.map(({ DATE, IDART, Q_VAR }) => ({
    product: productMap[IDART],
    diff: Q_VAR,
    type: 'Transaction',
    date: getDate(DATE),
    meta: `IDART:${IDART}`,
  })).filter(e => !!e.product);
}


module.exports = {
  transform,
};
