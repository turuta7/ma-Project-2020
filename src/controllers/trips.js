/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { TripFactory, TripSchemeFactory } = require('../utils/factory/trips');
const { subscribeFactory } = require('../utils/factory/subscribe');

const {
  getOneUserCardById,
  createSubscribe,
  createTrips,
  deleteSubscribe,
  deleteTripById,
  getTripsById,
  getAllTrips,
  getPassengersByTripId,
  getAllPassengers,
} = require('../utils/workMethodDB');

// ---------delete

const testTrips = async (ctx) => {
  const allTrips = await getAllTrips();
  const modifiedTrips = [];
  const modifyTrips = async (trips) => {
    for (const trip of trips) {
      trip.passengers = await getPassengersByTripId(trip.id);
      trip.seatsLeft = trip.seatsTotal - trip.passengers.length;
      modifiedTrips.push(trip);
    }
  };
  await modifyTrips(allTrips);
  const newBody = modifiedTrips.map((x) => TripFactory(x));
  ctx.body = newBody;
};

const testPassengers = async (ctx) => {
  const res = await getAllPassengers();
  console.log(res);
  ctx.body = res;
};

//---------------------
const getTripById = async (ctx) => {
  const { id } = ctx.params;
  const returnObject = await getTripsById(id);
  const returnCar = await getOneUserCardById(returnObject.driverId, returnObject.carId);
  returnObject.car = returnCar;
  const newBody = TripFactory(returnObject);
  ctx.body = newBody;
};

const createNewTrip = async (ctx) => {
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
    ctx.throw(error.status, error.message);
  }
};

const subscribeTrip = async (ctx) => {
  const requestBody = ctx.request.body;
  const tripId = ctx.params.trip_id;
  ctx.assert(requestBody.passengerId, requestBody.waypoint, 400, 'error data');
  try {
    const trip = await getTripsById(tripId);
    const tripSeatsTotal = trip.seatsTotal;
    const passengers = await getPassengersByTripId(tripId);
    if (passengers.length >= tripSeatsTotal) {
      ctx.throw(400, 'Sorry, free seats are over.');
    }
    requestBody.tripId = tripId;
    const response = await createSubscribe(requestBody);
    ctx.body = subscribeFactory(response);
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

const unsubscribeTrip = async (ctx) => {
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
    ctx.throw(error.status, error.message);
  }
};

const deleteTrip = async (ctx) => {
  const { trip_id } = ctx.params;
  try {
    const response = await deleteTripById(trip_id);
    const checkDb = response ? 'ok delete' : 'no trip db';
    console.log(checkDb);
    ctx.body = { message: `trip ${trip_id} delete` };
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

module.exports = {
  createNewTrip,
  getTripById,
  testPassengers,
  testTrips,
  subscribeTrip,
  unsubscribeTrip,
  deleteTrip,
};
