require('dotenv').config();
const { KeziaIIConnector } = require('./src');

const connector = new KeziaIIConnector();

connector.init();

connector.run();
