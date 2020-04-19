const Router = require('@koa/router');
const Knex = require('knex');
const { error500 } = require('../../utils/errorProcessing');

const {
  createSubscribe,
  createTrips,
  deleteSubscribe,
  deleteTripById,
} = require('../../utils/workMethodDB');

const dbOptions = require('../../config/config').DB;

const knex = new Knex(dbOptions);

const router = new Router();

// ---------delete

router.get('/testTrips', async (ctx) => {
  const getTrips = () => {
    return knex('trips')
      .select('*')
      .catch((err) => console.error(err));
  };
  const res = await getTrips();
  ctx.body = res;
});

router.get('/testPassengers', async (ctx) => {
  const getSub = () => {
    return knex('passengers')
      .select('*')
      .catch((err) => console.error(err));
  };
  const res = await getSub();
  ctx.body = res;
});

//---------------------

router.post('/', async (ctx) => {
  const requestBody = ctx.request.body;
  ctx.assert(
    requestBody.driverId &&
      requestBody.carId &&
      requestBody.startLatitude &&
      requestBody.startLongitude &&
      requestBody.route,
    400,
    'error data',
  );

  try {
    await createTrips(requestBody);
    ctx.body = { message: 'create ok' };
  } catch (error) {
    error500(ctx, error);
  }
});

router.post('/:trip_id/subscribe', async (ctx) => {
  const requestBody = ctx.request.body;
  ctx.assert(requestBody.passengerId, requestBody.waypoint, 400, 'error data');
  requestBody.tripId = ctx.params.trip_id;
  try {
    const response = await createSubscribe(requestBody);
    ctx.body = response;
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
