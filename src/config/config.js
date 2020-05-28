require('dotenv').config();

// const DB = require('../../knexfile')[process.env.NODE_ENV];

const config = {
  serverPort: process.env.SERVER_PORT,
  privateKeyToken: process.env.privateKeyToken,
  apiKey: process.env.apiKey,
  DB: {
    development: {
      client: 'postgresql',
      connection: {
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        database: process.env.DBNAME,
        user: process.env.DBUSER,
        password: process.env.DBPASSWD,
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },
    production: {
      client: 'postgresql',
      connection: {
        database: 'my_db',
        user: 'username',
        password: 'password',
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },
  },
};

module.exports = config;
