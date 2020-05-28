const Router = require('@koa/router');
const { users } = require('../controllers');

const router = new Router();
// Users

router.post('/login', users.loginUser);
router.post('/', users.createUser);
router.get('/', users.getAllUsers);
router.get('/:id', users.getUserById);
router.put('/:id', users.updateUser);
router.delete('/:id', users.deleteUser);

module.exports = router;
