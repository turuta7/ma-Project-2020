const Router = require('@koa/router');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error500 } = require('../utils/errorProcessing');
const { UserFactory, UserSchemeFactory } = require('../utils/factory/user');

const authorizationUser = require('../utils/authorization');
const {
  getOneUserByKey,
  getAllUserByKey,
  deleteUserByKey,
  updateUserByKey,
  createUserDb,
} = require('../utils/workMethodDB');

const router = new Router();

const saltRounds = 10;

// get email. Check password. return id, and token (id)
router.post('/login', async (ctx) => {
  const requestBody = ctx.request.body;
  ctx.assert(requestBody.email && requestBody.password, 400, 'Missing login/password');
  try {
    const user = await getOneUserByKey('email', requestBody.email, '*');
    if (user === undefined) {
      ctx.status = 403;
      ctx.body = { message: 'Incorrect mail' };
      return null;
    }
    const isValidPassword = bcrypt.compareSync(requestBody.password, user.password);
    const token = isValidPassword ? jwt.sign({ id: user.id }, process.env.privateKeyToken) : null;
    ctx.status = isValidPassword ? 200 : 403;
    const newBody = UserFactory(user);
    if (token) newBody.token = token;
    ctx.body = token ? newBody : { message: 'Invalid password' };
  } catch (error) {
    error500(ctx, error);
  }
  return null;
});

// Post user. return id and token (id)
router.post('/', async (ctx) => {
  const requestBody = ctx.request.body;
  console.log(requestBody);

  ctx.assert(requestBody.email && requestBody.password, 400, 'Missing login/password');
  try {
    const hashPassword = await bcrypt.hash(requestBody.password, saltRounds);
    requestBody.password = hashPassword;
    const createUser = await createUserDb(UserSchemeFactory(requestBody));
    const token = createUser
      ? await jwt.sign({ id: createUser.id }, process.env.privateKeyToken)
      : null;
    ctx.status = createUser ? 200 : 403;
    if (token == null) {
      ctx.status = 403;
      ctx.body = { message: 'User in db/Incorrect data' };
      return;
    }
    if (token) createUser.token = token;
    const newBody = UserFactory(createUser);
    ctx.body = newBody;
  } catch (error) {
    error500(ctx, error);
  }
  //  return null;
});

// Get users
router.get('/', async (ctx) => {
  // authorization user by token and by id
  try {
    const autUser = await authorizationUser(ctx);
    if (!autUser.status) {
      ctx.status = 403;
      ctx.body = { message: 'You are not authorized' };
      return null;
    }

    const users = await getAllUserByKey();
    if (users.length === 0) {
      ctx.body = { message: 'No user DB' };
      return null;
    }
    const newUsers = users.map((data) => UserFactory(data));
    ctx.body = newUsers;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
});

// Ger user by id
router.get('/:id', async (ctx) => {
  const idUser = ctx.params.id;
  const id = Number(idUser);

  // authorization user by token and by id
  try {
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || id !== autUser.id) {
      ctx.status = 403;
      ctx.body = { message: 'You are not authorized' };
      return null;
    }
    const user = await getOneUserByKey('id', id);
    const newUsers = await UserFactory(user);
    ctx.body = newUsers;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
});

// Update user by id
router.put('/:id', async (ctx) => {
  const requestBody = ctx.request.body;
  const idUser = ctx.params.id;
  const id = Number(idUser);

  // authorization user by token and by id
  try {
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || id !== autUser.id) {
      ctx.status = 403;
      ctx.body = { message: 'You are not authorized' };
      return null;
    }
    if (requestBody.password) {
      const hashPassword = await bcrypt.hash(requestBody.password, saltRounds);
      requestBody.password = hashPassword;
    }

    const updateUser = await updateUserByKey('id', id, UserSchemeFactory(requestBody));
    console.log(updateUser);

    const returnUpdateUser = updateUser
      ? UserFactory(updateUser)
      : { message: 'User not DB/User email unique/Incorrect data' };

    ctx.body = returnUpdateUser;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
});

// Delete user by id
router.delete('/:id', async (ctx) => {
  const idUser = ctx.params.id;
  const id = Number(idUser);

  // authorization user by token and by id
  try {
    const autUser = await authorizationUser(ctx);
    if (!autUser.status || id !== autUser.id) {
      ctx.status = 403;
      ctx.body = { message: 'You are not authorized' };
      return null;
    }

    const deleteUser = await deleteUserByKey('id', id);
    const returnDeleteUser =
      deleteUser === 1 ? { message: 'User delete ok' } : { message: 'User not DB' };
    console.log(deleteUser);
    ctx.body = returnDeleteUser;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
});

module.exports = router;
