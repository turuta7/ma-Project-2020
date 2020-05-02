const knexMigrate = require('knex-migrate');
const startServer = require('./server/server');

knexMigrate('up', {})
  .then(async (res) => {
    console.log(res);
    console.log('DB connection ok ');
  })
  .then(startServer())
  .catch((error) => console.log('no connection DB', error.message));
