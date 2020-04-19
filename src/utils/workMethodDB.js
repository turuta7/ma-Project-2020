const Knex = require('knex');
const dbOptions = require('../config/config').DB;

const knex = new Knex(dbOptions);

const objectSelect = [
  'id',
  'fullname',
  'email',
  'homeLatitude',
  'homeLongitude',
  'workLatitude',
  'workLongitude',
];

const objectSelectCarts = ['id', 'model', 'license', 'userId'];

// method user
const getOneUserByKey = (index, key, object = objectSelect) => {
  return knex('users')
    .where(`${index}`, key)
    .select(object)
    .first()
    .catch((err) => console.error(err));
};

const getAllUserByKey = () => {
  return knex('users')
    .select(objectSelect)
    .catch((err) => console.error(err));
};

const deleteUserByKey = (index, key) => {
  return knex('users')
    .where(`${index}`, key)
    .first()
    .delete()
    .catch((err) => console.error(err));
};

const updateUserByKey = (index, key, object = {}) => {
  return knex('users')
    .where(`${index}`, key)
    .first()
    .update(object)
    .catch((err) => console.error(err));
};

const createUserDb = (object = {}) => {
  return knex('users')
    .insert(object)
    .catch((err) => console.error(err));
};

// method: cars user
const createCarsUser = (object = {}) => {
  return knex('cars')
    .insert(object)
    .catch((err) => console.error(err));
};

const getAllUserCardById = (id) => {
  return knex('cars')
    .where('userId', id)
    .select(objectSelectCarts)
    .catch((err) => console.error(err));
};

const deleteCarsUserById = (idUser = 0, idCar) => {
  return knex('cars')
    .where('userId', idUser)
    .where('id', idCar)
    .delete()
    .catch((err) => console.error(err));
};

// method: passengers/trips

const createTrips = (requestBody = {}) => {
  return knex('trips')
    .insert(requestBody)
    .catch((err) => console.error(err));
};

const createSubscribe = (object = {}) => {
  return knex('passengers')
    .insert(object)
    .catch((err) => console.error(err));
};

const deleteSubscribe = (key, passengerId) => {
  return knex('passengers')
    .where('tripId', key)
    .where('passengerId', passengerId)
    .delete()
    .catch((err) => console.error(err));
};

const deleteTripById = (key) => {
  return knex('trips')
    .where('id', key)
    .delete()
    .catch((err) => console.error(err));
};

module.exports = {
  getOneUserByKey,
  getAllUserByKey,
  deleteUserByKey,
  updateUserByKey,
  createUserDb,
  createCarsUser,
  getAllUserCardById,
  deleteCarsUserById,
  createTrips,
  createSubscribe,
  deleteSubscribe,
  deleteTripById,
};
