const Router = require('@koa/router');
const Knex = require('knex');
const dbOptions = require('../../config/config').DB;

const knex = new Knex(dbOptions);

const router = new Router();

// Return body as response
router.post('/', async (ctx) => {
  const object = ctx.request.body;
  ctx.assert(object.email && object.password && object.fullname, 400, 'err');
  const userCreate = async () => {
    return new Promise((resolve) => {
      knex('users')
        .insert(object)
        .then((result) => {
          console.log(result);
          resolve((ctx.body = { user: 'Create user ok' }));
        })
        .catch((e) => {
          console.error(e);
          ctx.status = 403;
          resolve((ctx.body = { user: 'User create error' }));
        });
    });
  };
  await userCreate();
});
router.get('/', async (ctx) => {
  const getUser = async () => {
    return new Promise((resolve) => {
      knex('users')
        .select('*')
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
  await getUser();
});

router.get('/:id', async (ctx) => {
  const idUser = ctx.params.id;
  const id = Number(idUser);
  const getUserId = async () => {
    return new Promise((resolve) => {
      knex('users')
        .where('id', id)
        .first()
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
          resolve((ctx.body = { user: 'error user id' }));
        });
    });
  };
  await getUserId();
});
router.put('/:id', async (ctx) => {
  const object = ctx.request.body;
  const idUser = ctx.params.id;
  ctx.assert(object.email && object.password && object.fullname && idUser, 400, 'err');
  const id = Number(idUser);
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
  await updateUserId();
});
router.delete('/:id', async (ctx) => {
  const idUser = ctx.params.id;
  const id = Number(idUser);
  const deleteUserId = async () => {
    return new Promise((resolve) => {
      knex('users')
        .where('id', id)
        .first()
        .delete()
        .then((result) => {
          if (result === 1) {
            resolve((ctx.body = { message: 'user delete ok' }));
          } else {
            console.log(result);
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
  await deleteUserId();
});

module.exports = router;
