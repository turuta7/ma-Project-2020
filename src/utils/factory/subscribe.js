const subscribeFactory = ({ id, tripId, passengerId, waypoint }) => {
  const cars = {
    id: Number(id),
    tripId: Number(tripId),
    passengerId: Number(passengerId),
    waypoint: Number(waypoint),
  };

  return cars;
};

module.exports = {
  subscribeFactory,
};
