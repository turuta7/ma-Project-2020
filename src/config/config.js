require('dotenv').config();

const DbKnex = require('../../knexfile.js')[process.env.NODE_ENV];

const config = {
  serverPort: process.env.SERVER_PORT,
  privateKeyToken: process.env.privateKeyToken,
  apiKey: process.env.apiKey,
  env: process.env.NODE_ENV,
  DB: DbKnex,
};

module.exports = config;
