const { carFactory } = require('./cars');
// const { PassengerFactory } = require('./passenger');
const TripFactory = ({
  id,
  driverId,
  departureTime,
  startLatitude,
  startLongitude,
  seatsTotal,
  // passengers = [],
  car = {},
  route,
}) => {
  try {
    const trip = {
      id,
      driverId: Number(driverId),
      departureTime,
      start: [Number(startLatitude), Number(startLongitude)],
      seatsTotal,
      car: carFactory(car),
      // seatsLeft: Number(seatsTotal, 10) - passengers.length,
      route: JSON.parse(route),
    };
    return trip;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const TripSchemeFactory = ({
  driverId = 0,
  departureTime = new Date(),
  start = [0, 0],
  seatsTotal = 0,
  car = {},
  route = [],
}) => {
  console.log('xer', car.id);

  try {
    const trip = {
      driverId,
      departureTime: new Date(departureTime),
      startLatitude: start[0],
      startLongitude: start[1],
      seatsTotal,
      carId: Number(car.id),
      route,
    };

    return trip;
  } catch (error) {
    console.error(error);
  }
  return null;
};

module.exports = {
  TripFactory,
  TripSchemeFactory,
};
