const jwt = require('jsonwebtoken');

module.exports = async (ctx) => {
  const { authorization } = ctx.request.header;
  console.log('----', authorization);
  let result = {};
  if (authorization === undefined) {
    result = { status: false };
    return result;
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.privateKeyToken, (err, decoded) => {
    if (err) console.error(err);
    console.log('decoded', decoded);

    if (decoded === undefined) {
      ctx.status = 400;
      result = { status: false };
    } else result = { status: true, id: decoded.id };
  });
  console.log(result);

  return result;
};
