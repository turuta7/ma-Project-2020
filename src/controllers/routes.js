const axios = require('axios');
const config = require('../config/config');

const getRoute = async (ctx) => {
  try {
    const url = new URL(ctx.URL);
    if (!url.search) {
      ctx.throw(400, 'error URL');
    }
    const newUrl = `https://route.ls.hereapi.com/routing/7.2/calculateroute.json${url.search}&apiKey=${config.apiKey}`;

    const returnResponse = await axios.get(newUrl);
    const { shape } = returnResponse.data.response.route[0];
    const returnResult = shape.map((coordinates) =>
      coordinates.split(',').map((point) => Number(point)),
    );
    const result = returnResult || { message: 'error URL' };
    ctx.body = result;
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

module.exports = { getRoute };
