/* eslint-disable no-restricted-syntax */
const Knex = require('knex');
const dbOptions = require('../config/config').DB;

// eslint-disable-next-line no-unused-vars
const knex = new Knex(dbOptions);
