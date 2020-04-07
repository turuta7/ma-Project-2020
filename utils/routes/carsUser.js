const Router = require('@koa/router');
const { error500 } = require('../errorProcessing');
const {
  getOneUserByKey,
  createCarsUser,
  getAllUserCardById,
  deleteCarsUserById,
} = require('../workMethodDB');

const router = new Router();

router.get('/', async (ctx) => {
  const { id } = ctx.params;
  try {
    const allCarsUser = await getAllUserCardById(id);
    const returnCarsUser = allCarsUser || { message: 'message: User no cars' };
    ctx.body = returnCarsUser;
  } catch (error) {
    error500(ctx, error);
  }
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
    const testDeleteUser = await deleteCarsUserById(id, idCar);
    const response = testDeleteUser ? { message: 'delete car' } : { message: 'no cars user' };
    ctx.body = response;
  } catch (error) {
    error500(ctx, error);
  }
});

module.exports = router;
