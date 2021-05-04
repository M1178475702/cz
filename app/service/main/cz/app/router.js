'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  require('./router/internal/redpack')(app);

  require('./router/internal/wxapp')(app);

  require('./router/internal/user')(app);

  require('./router/web/acm')(app);

  require('./router/server/timerTask')(app);

  require('./router/back/topic')(app);

  require('./router/web/reply')(app);

  require('./router/web/topic')(app);

  require('./router/web/redpack')(app);

  require('./router/web/index')(app);

  require('./router/back/tag')(app);

  // require('./router/web/collection')(app);

  require('./router/server/wingmanClient')(app);

  require('./router/web/wxapp')(app);

  require('./router/back/comment')(app);

  require('./router/web/comment')(app);

  require('./router/web/user')(app);

  require('./router/web/article')(app);

  require('./router/upload/image')(app);

  require('./router/back/section')(app);

  require('./router/back/article')(app);

  require('./router/back/admin')(app);

};

