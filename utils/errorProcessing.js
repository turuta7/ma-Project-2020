const error500 = (ctx, error) => {
  if (!ctx && !error) {
    return 'error data';
  }
  console.error(error);
  ctx.status = 500;
  ctx.body = { message: 'internal server error' };
  return null;
};

module.exports = { error500 };
