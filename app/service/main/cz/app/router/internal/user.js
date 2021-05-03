module.exports = app => {
    const { router, controller } = app;
    const internal_api = controller.internal;
    const base_path = '/internal/user';

    router.post(base_path + '/login',internal_api.user.login)

};
