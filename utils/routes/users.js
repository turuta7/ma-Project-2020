const Router = require('@koa/router');
const Knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbOptions = require('../../config/config').DB;
const authorizationUser = require('../authorization');

const knex = new Knex(dbOptions);

const router = new Router();

const saltRounds = 10;

// get email. Check password. return id, and token (id, fullname)
router.post('/login', async (ctx) => {
  const object = ctx.request.body;
  this.assert(object.email && object.password, 400, 'not entered data');
  const getUser = async () => {
    return new Promise((resolve) => {
      knex('users')
        .where('email', object.email)
        .first()
        .then((result) => {
          if (result === undefined) {
            ctx.status = 403;
            resolve((ctx.body = { message: 'no user id' }));
          } else {
            // decoder
            bcrypt.compare(object.password, result.password, (err, res) => {
              if (res) {
                jwt.sign(
                  { id: res.id, fullname: res.fullname },
                  process.env.privateKeyToken,
                  (ee, token) => {
                    resolve((ctx.body = { user_id: result.id, token }));
                    return null;
                  },
                );
              }
            });
          }
        })
        .catch((e) => {
          console.error(e);
          ctx.status = 403;
          resolve((ctx.body = { user: 'error user id' }));
        });
    });
  };
  try {
    await getUser();
  } catch (error) {
    console.error(error);
  }
  return null;
});

// Post user. return id and token (id, fullname)
router.post('/', async (ctx) => {
  const object = ctx.request.body;
  this.assert(object.email && object.password, 400, 'not entered data');
  const userCreate = async () => {
    return new Promise((resolve) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(object.password, salt, (e, hash) => {
          object.password = hash;
        });
      });
      knex('users')
        .insert(object)
        .then((result) => {
          console.log(result);
          knex('users')
            .where('email', object.email)
            .then((res) => {
              console.log(res[0].id);
              jwt.sign(
                { id: res[0].id, fullname: object.fullname },
                process.env.privateKeyToken,
                (ee, token) => {
                  console.error(ee);
                  resolve((ctx.body = { user_id: res[0].id, token }));
                },
              );
            });
        })
        .catch((er) => {
          console.error(er);
          ctx.status = 403;
          resolve((ctx.body = { user: 'User create error' }));
        });
    });
  };
  try {
    await userCreate();
  } catch (error) {
    console.error(error);
  }
  return null;
});

// Get users
router.get('/', async (ctx) => {
  const getUser = async () => {
    return new Promise((resolve) => {
      knex('users')
        .select([
          'id',
          'fullname',
          'email',
          'homeLatitude',
          'homeLongitude',
          'workLatitude',
          'workLongitude',
        ])
        .then((result) => {
          if (result === undefined) {
            resolve((ctx.body = { message: 'no user id' }));
          } else {
            console.log(result);
            resolve((ctx.body = result));
          }
        })
        .catch((e) => {
          console.error(e);
          ctx.status = 403;
          resolve((ctx.body = { message: 'error' }));
        });
    });
  };
  try {
    await getUser();
  } catch (error) {
    console.error(error);
  }
  return null;
});

// Ger user by id
router.get('/:id', async (ctx) => {
  const idUser = ctx.params.id;
  const id = Number(idUser);
  // authorization user by token and by id
  const autUser = await authorizationUser(ctx);
  if (!autUser.status || id !== autUser.id) {
    ctx.status = 403;
    ctx.body = { message: 'you are not authorized' };
    return null;
  }

  const getUserId = async () => {
    return new Promise((resolve) => {
      knex('users')
        .where('id', id)
        .select([
          'id',
          'fullname',
          'email',
          'homeLatitude',
          'homeLongitude',
          'workLatitude',
          'workLongitude',
        ])
        .first()
        .then((result) => {
          if (result === undefined) {
            ctx.status = 403;
            resolve((ctx.body = { message: 'no user id' }));
          } else {
            console.log(result);
            resolve((ctx.body = result));
          }
        })
        .catch((e) => {
          console.error(e);
          ctx.status = 403;
          resolve((ctx.body = { user: 'error user id' }));
        });
    });
  };
  try {
    await getUserId();
  } catch (error) {
    console.error(error);
  }
  return null;
});

// Update user by id
router.put('/:id', async (ctx) => {
  const object = ctx.request.body;
  const idUser = ctx.params.id;
  this.assert(object.email && object.password && idUser, 400, 'not entered data');
  const id = Number(idUser);
  // authorization user by token and by id
  const autUser = await authorizationUser(ctx);
  if (!autUser.status || id !== autUser.id) {
    ctx.status = 403;
    ctx.body = { message: 'you are not authorized' };
    return null;
  }
  const updateUserId = async () => {
    return new Promise((resolve) => {
      knex('users')
        .where('id', id)
        .first()
        .update(object)
        .then((result) => {
          if (result === 1) {
            resolve((ctx.body = { message: 'user update ok' }));
          } else {
            console.log(result);
            ctx.status = 403;
            resolve((ctx.body = { message: 'not user id' }));
          }
        })
        .catch((e) => {
          console.error(e);
          ctx.status = 403;
          resolve((ctx.body = { user: 'error update id' }));
        });
    });
  };
  try {
    await updateUserId();
  } catch (error) {
    console.error(error);
  }
  return null;
});

// Delete user by id
router.delete('/:id', async (ctx) => {
  const idUser = ctx.params.id;
  const id = Number(idUser);
  // authorization user by token and by id
  const autUser = await authorizationUser(ctx);
  if (!autUser.status || id !== autUser.id) {
    ctx.status = 403;
    ctx.body = { message: 'you are not authorized' };
    return null;
  }
  const deleteUserId = async () => {
    return new Promise((resolve) => {
      knex('users')
        .where('id', id)
        .first()
        .delete()
        .then((result) => {
          if (result === 1) {
            resolve((ctx.body = { message: `user ${id} delete ok` }));
          } else {
            console.log(result);
            ctx.status = 403;
            resolve((ctx.body = { message: 'not user id' }));
          }
        })
        .catch((e) => {
          console.error(e);
          ctx.status = 403;
          resolve((ctx.body = { user: 'error delete id' }));
        });
    });
  };
  try {
    await deleteUserId();
  } catch (error) {
    console.error(error);
  }
  return null;
});

module.exports = router;
