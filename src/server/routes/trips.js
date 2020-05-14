const Router = require('@koa/router');
const Knex = require('knex');
const { TripFactory, TripSchemeFactory } = require('../../utils/factory/trips');
const { subscribeFactory } = require('../../utils/factory/subscribe');
const { error500 } = require('../../utils/errorProcessing');
// const { getOneUserCardById, getTripsById } = require('../../utils/workMethodDB');

const {
  getOneUserCardById,
  createSubscribe,
  createTrips,
  deleteSubscribe,
  deleteTripById,
  getTripsById,
  getAllTrips,
  getPassengersByTripId,
} = require('../../utils/workMethodDB');

const dbOptions = require('../../config/config').DB;

const knex = new Knex(dbOptions);

const router = new Router();

// ---------delete

router.get('/testTrips', async (ctx) => {
  const returnObject = await getAllTrips();
  const newBody = returnObject.map((x) => TripFactory(x));
  ctx.body = newBody;
});

router.get('/testPassengers', async (ctx) => {
  const getSub = () => {
    return knex('passengers')
      .select('*')
      .catch((err) => console.error(err));
  };
  const res = await getSub();
  console.log(res);

  ctx.body = res;
});

//---------------------
router.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  const returnObject = await getTripsById(id);
  const returnCar = await getOneUserCardById(returnObject.driverId, returnObject.carId);
  returnObject.car = returnCar;
  const newBody = TripFactory(returnObject);
  ctx.body = newBody;
});

router.post('/', async (ctx) => {
  const requestBody = ctx.request.body;
  ctx.assert(requestBody.driverId && requestBody.route && requestBody.car.id, 400, 'error data');

  try {
    requestBody.route = JSON.stringify(requestBody.route);
    const returnObject = await createTrips(TripSchemeFactory(requestBody));
    returnObject.car = { id: returnObject.carId };
    const returnCar = await getOneUserCardById(returnObject.driverId, returnObject.carId);
    returnObject.car = returnCar;
    ctx.body = TripFactory(returnObject);
  } catch (error) {
    error500(ctx, error);
  }
});

router.post('/:trip_id/subscribe', async (ctx) => {
  const requestBody = ctx.request.body;
  const tripId = ctx.params.trip_id;
  ctx.assert(requestBody.passengerId, requestBody.waypoint, 400, 'error data');
  try {
    const trip = await getTripsById(tripId);
    const tripSeatsTotal = trip.seatsTotal;
    const passengers = await getPassengersByTripId(tripId);
    if (passengers.length >= tripSeatsTotal) {
      ctx.status = 400;
      ctx.body = { message: 'Sorry, free seats are over.' };
      return null;
    }
    requestBody.tripId = tripId;
    const response = await createSubscribe(requestBody);
    ctx.body = subscribeFactory(response);
  } catch (error) {
    error500(ctx, error);
  }
});

router.post('/:trip_id/unsubscribe', async (ctx) => {
  const requestBody = ctx.request.body;
  const { passengerId } = requestBody;
  ctx.assert(passengerId, 400, 'error data');
  const { trip_id } = ctx.params;
  try {
    const response = await deleteSubscribe(trip_id, Number(passengerId));
    const checkDb = response ? 'ok delete' : 'no subscribe db';
    console.log(checkDb);
    ctx.body = { message: `subscribe: ${passengerId}, trip: ${trip_id} delete` };
  } catch (error) {
    error500(ctx, error);
  }
});

router.delete('/:trip_id', async (ctx) => {
  const { trip_id } = ctx.params;
  try {
    const response = await deleteTripById(trip_id);
    const checkDb = response ? 'ok delete' : 'no trip db';
    console.log(checkDb);
    ctx.body = { message: `trip ${trip_id} delete` };
  } catch (error) {
    error500(ctx, error);
  }
});

module.exports = router;
