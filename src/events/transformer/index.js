const kAppApi = require('../../k-app-api');

async function transform(data) {

  const products = await kAppApi.getAllProducts();
  // TODO Transform
  return data;
}

module.exports = {
  transform,
};
