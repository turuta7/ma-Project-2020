const Router = require('@koa/router');

const users = require('./users');
const carsUser = require('./carsUser');

const router = new Router();

router.use('/api/users', users.routes());
router.use('/api/users/:id/cars', carsUser.routes());

module.exports = router;
