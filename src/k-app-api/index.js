const axios = require('axios').default;

axios.defaults.baseURL = process.env.K_APP_URL;
// TODO Generate token
axios.defaults.headers.common.Authorization = process.env.K_APP_AUTH_TOKEN;

async function sendStockEvents(data) {
  const res = await axios.post('/api/v2/inventory-management/stock-events', data);
  console.log('Stock events sent. Received:', res.data);
  return res;
}

async function getAllProducts() {
  const res = await axios.get('/api/v2/inventory-management/products');
  console.log('Products received:', res.data);
  // FIXME Remove pagination
  return res.data;
}

module.exports = {
  sendStockEvents,
  getAllProducts,
};
