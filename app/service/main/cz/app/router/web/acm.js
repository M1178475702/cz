module.exports = app => {
    const {router, controller} = app;
    const webapi = controller.web;
    const base_path = '/web/acm';

    router.post(base_path + '/register', webapi.acm.createAcmUser);
};

