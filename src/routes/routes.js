const Router = require('@koa/router');
const { routes } = require('../controllers');

const router = new Router();
// Routes

router.get('/', routes.getRoute);

module.exports = router;
