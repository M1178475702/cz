module.exports = app => {
    const { router, controller } = app;
    const internal_api = controller.internal;
    const base_path = '/internal/wxapp';

    router.get(base_path + '/app/access_token',internal_api.wxapp.getAppAccsessToken)

};
