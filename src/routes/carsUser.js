const Router = require('@koa/router');
const { carsUsers } = require('../controllers');

const router = new Router();

router.post('/', carsUsers.createCar);
router.get('/', carsUsers.getCarsByUserId);
router.delete('/:idCar', carsUsers.deleteCar);

module.exports = router;
