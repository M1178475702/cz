module.exports = app => {
    const { router, controller } = app;
    const internal_api = controller.internal;
    const base_path = '/internal/redpack';

    router.post(base_path + '/send',internal_api.redpack.sendByOpenId)

};
