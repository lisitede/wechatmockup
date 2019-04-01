const Service = require('egg').Service;
const rnd = require('vanilla.js/random/dummy');


let memoryCache = {};


module.exports = class OAuth extends Service {
  get(alias, code) {
    const data = Object.assign({}, memoryCache[code]);
    if (data.alias === alias) {
      delete memoryCache[code];
      return data;
    } else {
      return {};
    }
  }

  async getAccessToken(alias, code, openId) {
    const { ctx } = this;
    try {
      const accessToken = rnd();
      memoryCache[code] = { alias, accessToken, openId };
    } catch (err) {
      ctx.logger.error(err);
    }
  }
}
