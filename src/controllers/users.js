const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config')
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

const saltRounds = 10;

const loginUser = async (ctx) => {
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
    const token = isValidPassword ? jwt.sign({ id: user.id }, config.privateKeyToken) : null;
    ctx.status = isValidPassword ? 200 : 403;
    const newBody = UserFactory(user);
    if (token) newBody.token = token;
    ctx.body = token ? newBody : { message: 'Invalid password' };
  } catch (error) {
    error500(ctx, error);
  }
  return null;
};

// Post user. return id and token (id)
const createUser = async (ctx) => {
  const requestBody = ctx.request.body;
  console.log(requestBody);

  ctx.assert(requestBody.email && requestBody.password, 400, 'Missing login/password');
  try {
    const hashPassword = await bcrypt.hash(requestBody.password, saltRounds);
    requestBody.password = hashPassword;
    const newUser = await createUserDb(UserSchemeFactory(requestBody));
    const token = newUser ? jwt.sign({ id: newUser.id }, config.privateKeyToken) : null;
    ctx.status = newUser ? 200 : 403;
    if (token == null) {
      ctx.status = 403;
      ctx.body = { message: 'User in db/Incorrect data' };
      return;
    }
    if (token) newUser.token = token;
    const newBody = UserFactory(newUser);
    ctx.body = newBody;
  } catch (error) {
    error500(ctx, error);
  }
  //  return null;
};

// Get users
const getAllUsers = async (ctx) => {
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
};

// Ger user by id
const getUserById = async (ctx) => {
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
    const newUsers = UserFactory(user);
    ctx.body = newUsers;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
};

// Update user by id
const updateUser = async (ctx) => {
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

    const newUser = await updateUserByKey('id', id, UserSchemeFactory(requestBody));
    console.log(newUser);

    const returnUpdateUser = newUser
      ? UserFactory(newUser)
      : { message: 'User not DB/User email unique/Incorrect data' };

    ctx.body = returnUpdateUser;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
};

// Delete user by id
const deleteUser = async (ctx) => {
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

    const delUser = await deleteUserByKey('id', id);
    const returnDeleteUser =
      delUser === 1 ? { message: 'User delete ok' } : { message: 'User not DB' };
    console.log(delUser);
    ctx.body = returnDeleteUser;
  } catch (error) {
    error500(ctx, error);
  }

  return null;
};

module.exports = { loginUser, createUser, getUserById, getAllUsers, updateUser, deleteUser };
