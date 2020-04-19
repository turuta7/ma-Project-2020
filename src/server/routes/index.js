const Router = require('@koa/router');

const users = require('./users');
const carsUser = require('./carsUser');
const routes = require('./routes');
const trips = require('./trips');

const router = new Router();

router.use('/api/users', users.routes());
router.use('/api/users/:id/cars', carsUser.routes());
router.use('/api/routes/', routes.routes());
router.use('/api/trips', trips.routes());

module.exports = router;
