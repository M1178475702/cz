module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/redpack';

    router.post(base_path + '/send/article/inside' ,webapi.redpack.sendSingleRedPack);
};

