const Router = require('@koa/router');
const authorizationUser = require('../../utils/authorization');
const { carFactory } = require('../../utils/factory/cars');
const { error500 } = require('../../utils/errorProcessing');
const {
  getOneUserByKey,
  createCarsUser,
  getAllUserCardById,
  deleteCarsUserById,
} = require('../../utils/workMethodDB');

const router = new Router();

router.get('/', async (ctx) => {
  const { id } = ctx.params;

  try {
    // authorization user by token and by id
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || Number(id) !== autUser.id) {
      ctx.status = 403;
      ctx.body = { message: 'You are not authorized' };
      return null;
    }

    const allCarsUser = await getAllUserCardById(id);
    const returnCarFactory = allCarsUser.map((x) => carFactory(x));
    const returnCarsUser = returnCarFactory || { message: 'message: User no cars' };
    ctx.body = returnCarsUser;
  } catch (error) {
    error500(ctx, error);
  }
  return null;
});

router.post('/', async (ctx) => {
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
    error500(ctx, error);
  }
});

router.delete('/:idCar', async (ctx) => {
  const { id, idCar } = ctx.params;
  try {
    // authorization user by token and by id
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || Number(id) !== autUser.id) {
      ctx.status = 403;
      ctx.body = { message: 'You are not authorized' };
      return null;
    }

    const testDeleteUser = await deleteCarsUserById(id, idCar);
    if (!testDeleteUser) console.error('no cars user in DB');
    ctx.body = { message: `delete car ${idCar}` };
  } catch (error) {
    error500(ctx, error);
  }
  return null;
});

module.exports = router;
