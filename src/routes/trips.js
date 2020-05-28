const Router = require('@koa/router');
const { trips } = require('../controllers');

const router = new Router();
// Trips

router.get('/testTrips', trips.testTrips);
router.get('/testPassengers', trips.testPassengers);
router.post('/', trips.createNewTrip);
router.get('/:id', trips.getTripById);
router.post('/:trip_id/subscribe', trips.subscribeTrip);
router.post('/:trip_id/unsubscribe', trips.unsubscribeTrip);
router.delete('/:trip_id', trips.deleteTrip);

module.exports = router;
