const Controller = require('egg').Controller;
const rnd = require('vanilla.js/random/dummy');


module.exports = class PivotController extends Controller {
  async base() {
    const { ctx, config } = this;
    const { alias } = ctx.params;
    const { redirect } = ctx.request.body;

    if (!alias) {
      throw new Error('INVALID ALIAS');
    }

    if (!redirect) {
      throw new Error('INVALID REDIRECT');
    }

    const conf = ctx.service.alias.conf(alias);
    // ctx.logger.info(conf);
    const { appid } = conf;

    // ctx.logger.info(alias, redirect, appid);
    const openurl = config.props['openurl.wechatpivot'];

    const code = rnd();
    const url = `${openurl}/apps/${alias}/oauth?redirect=${encodeURIComponent(redirect)}&code=${code}`;

    ctx.status = 201;
    ctx.body = { url };
  }

  async oauth() {
    const { ctx } = this;
    const { alias } = ctx.params;
    const { redirect, code } = ctx.queries;

    if (!redirect) {
      throw new Error('INVALID REDIRECT');
    }

    if (!code) {
      throw new Error('INVALID CODE');
    }

    // await ctx.service.oauth.getAccessToken(code);

    let r = redirect;
    if (r.indexOf('?') > -1) {
      r += '&code=' + code;
    } else {
      r += '?code=' + code;
    }

    await ctx.render('oauth.html', { alias, redirect: r, code });
  }

  async oauthInfo() {
    const { ctx } = this;
    const { alias } = ctx.params;
    const { code } = ctx.queries;

    const { openId } = ctx.service.oauth.get(alias, code);

    ctx.status = 200;
    ctx.body = { openId };
  }

  async jssdkConfig() {
    const { ctx, config } = this;
    const { url } = ctx.queries;

    if (!url || url.length === 0) {
      throw new Error('INVALID URL');
    }

    const signature = url[0].toUpperCase().replace(/[://.-]/ig, rnd());

    const appId = config.props['wechat.appid']

    ctx.body = {
      appId,
      timestamp: parseInt(new Date().getTime() / 1000, 0) + '',
      nonceStr: rnd(),
      signature,
    };
    ctx.status = 201;
  }
}
