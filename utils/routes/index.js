const Router = require('@koa/router');

const users = require('./users');
const carsUser = require('./carsUser');
const routes = require('./routes');

const router = new Router();

router.use('/api/users', users.routes());
router.use('/api/users/:id/cars', carsUser.routes());
router.use('/api/routes/', routes.routes());

module.exports = router;
