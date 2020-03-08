require('dotenv').config();

const DB = require('../knexfile')[process.env.NODE_ENV];

const config = {
  DB,
};

module.exports = config;
