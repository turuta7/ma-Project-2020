const authorizationUser = require('../utils/authorization');
const { carFactory } = require('../utils/factory/cars');
const {
  getOneUserByKey,
  createCarsUser,
  getAllUserCardById,
  deleteCarsUserById,
} = require('../utils/workMethodDB');

const getCarsByUserId = async (ctx) => {
  const { id } = ctx.params;

  try {
    // authorization user by token and by id
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || Number(id) !== autUser.id) {
      ctx.throw(403, 'You are not authorized');
    }

    const allCarsUser = await getAllUserCardById(id);
    const returnCarFactory = allCarsUser.map((x) => carFactory(x));
    const returnCarsUser = returnCarFactory || { message: 'message: User no cars' };
    ctx.body = returnCarsUser;
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

const createCar = async (ctx) => {
  const { id } = ctx.params;
  const requestBody = ctx.request.body;
  ctx.assert(requestBody.model && requestBody.license, 400, 'Missing model/license');
  requestBody.userId = id;
  try {
    const testUserDb = await getOneUserByKey('id', id);
    const returnUserDb = testUserDb
      ? await createCarsUser(requestBody)
      : { message: 'User no DB/Incorrect data' };
    const response = returnUserDb
      ? { message: `Cars user ${id} created` }
      : { message: 'Invalid data' };
    ctx.body = response;
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

const deleteCar = async (ctx) => {
  const { id, idCar } = ctx.params;
  try {
    // authorization user by token and by id
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || Number(id) !== autUser.id) {
      ctx.throw(403, 'You are not authorized');
    }

    const testDeleteUser = await deleteCarsUserById(id, idCar);
    if (!testDeleteUser) console.error('no cars user in DB');
    ctx.body = { message: `delete car ${idCar}` };
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

module.exports = { createCar, getCarsByUserId, deleteCar };
