'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', 'home.index');

  // app.get('/oauth', 'pivot.oauth');
  // app.get('/private-api/oauth/snsapi-base', 'pivot.oauthInfo');
  // app.get('/private-api/jssdk/config', 'pivot.jssdkConfig');

  router.post('/api/login', controller.api.login);
  router.get('/api/users', controller.api.users);

  // v2
  router.post('/wechatpivot/api/apps/:alias/oauth-snsapi-base-url', controller.pivotapi.base);
  router.get('/wechatpivot/apps/:alias/oauth', controller.pivotview.oauth);
  router.get('/wechatpivot/api/apps/:alias/oauth-snsapi-base', controller.pivotapi.oauth);
};
