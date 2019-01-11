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

  const articles = data.reduce((acc, { IDART, DEF }) => ({ ...acc, [IDART]: DEF }), {});

  const usedProducts = new Set();

  // Create a cross join array with string similarity for each pairs
  const ratings = Object
    .entries(articles)
    .map(([idart, def]) => products.map(({ _id, name }) => ({
      article: def,
      articleId: idart,
      product: name,
      productId: _id,
      // TODO Find a better comparison algorithm
      //  In order to improve rating for simple mistakes like 'mikl' instead of 'milk'
      similarity: stringSimilarity.compareTwoStrings(normalizeName(def), normalizeName(name)),
    })))
    // Flatten array (flatMap not available yet)
    .reduce((acc, el) => acc.concat(el), [])
    .sort((a, b) => b.similarity - a.similarity)
    .filter(o => o.similarity > MATCH_THRESHOLD)
    // Remove duplicate product match
    .filter((o) => {
      if (usedProducts.has(o.productId)) return false;
      usedProducts.add(o.productId);
      return true;
    })
    .reduce((acc, r) => ({ ...acc, [r.articleId]: r.productId }), {});

  // Now we reduce this cross joi array
  return Object
    .keys(articles)
    .map(idart => ratings.find(r => r.articleId === idart))
    .filter(r => !!r)
    .reduce((acc, rating) => ({ ...acc, [rating.articleId]: rating.productId }), {});
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

  console.log('Product - article map', productMap);
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
