
module.exports = app => {
    // 将 static 中间件放到 bodyParser 之前
    app.config.coreMiddleware.push('swagger');
    app.config.coreMiddleware.push('docs');
};
