const Sender = require('./lib/RedPackSender');

module.exports = async app => {
    const config = app.config;
    app.redpack = new Sender(config.redPack);
    await app.redpack.ready();
};
