const axios = require('axios').default;
const { isTesting } = require('../utils');

// The system will not totally work after 1000 products
const PRODUCT_PAGE_SIZE = 1000;

axios.defaults.baseURL = process.env.K_APP_URL;

const TEST_PRODUCTS = [
  {
    _id: 1,
    name: 'Fût triple K',
  },
  {
    _id: 2,
    name: 'Fût ninka triple',
  },
  {
    _id: 3,
    name: 'Fût ninka fipa',
  },
  {
    _id: 4,
    name: 'Fût ninka noel',
  },
];

async function connect() {
  if (isTesting()) return;
  const { data } = await axios.post('/api/v1/auth/login', {
    email: process.env.K_APP_USERNAME,
    password: process.env.K_APP_PASSWORD,
    // 5 minutes token
    rememberMe: 5,
  });

  axios.defaults.headers.common.Authorization = `Bearer ${data.jwt}`;
}

function disconnect() {
  // Don't really need to send disconnect
  axios.defaults.headers.common.Authorization = '';
}

async function sendStockEvents(data) {
  if (data.length === 0 || isTesting()) return undefined;
  const res = await axios.post('/api/v2/inventory-management/stock-events', { entities: data });
  console.log('Stock events sent. Received:', res.data);
  return res;
}

async function getAllProducts() {
  if (isTesting()) return TEST_PRODUCTS;
  const res = await axios.get(`/api/v2/inventory-management/products?pageSize=${PRODUCT_PAGE_SIZE}`);
  console.log('Products received:', res.data);
  return res.data.rows;
}

module.exports = {
  connect,
  disconnect,
  sendStockEvents,
  getAllProducts,
};
