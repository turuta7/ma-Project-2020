const Router = require('@koa/router');
const axios = require('axios');

const router = new Router();

router.get('/', async (ctx) => {
  const url = await new URL(ctx.URL);
  if (!url.search) {
    ctx.status = 400;
    ctx.body = { message: 'error URL' };
    return null;
  }
  const newUrl = `https://route.ls.hereapi.com/routing/7.2/calculateroute.json${url.search}&apiKey=${process.env.apiKey}`;

  try {
    const returnResponse = await axios.get(newUrl);
    const { shape } = returnResponse.data.response.route[0];
    const returnResult = shape.map((coordinates) =>
      coordinates.split(',').map((point) => Number(point)),
    );
    const result = returnResult || { message: 'error URL' };
    ctx.body = result;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: 'error URL' };
  }
  return null;
});

module.exports = router;
