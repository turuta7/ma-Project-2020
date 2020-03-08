const knexMigrate = require('knex-migrate');
const startServer = require('../utils/server');

(async () => {
  await knexMigrate('up', {})
    .then(async (res) => {
      console.log(res);
      console.log('DB connection ok ');
      try {
        await startServer();
      } catch (err) {
        console.error('error server', err);
      }
    })
    .catch((error) => console.log('no connection DB', error.message));
})();
