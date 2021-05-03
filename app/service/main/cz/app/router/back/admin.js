module.exports = app => {
  const { router, controller } = app;
  const backapi = controller.back;
  const base_path = '/back/admin';

  router.post(base_path + '/login',backapi.admin.login)

};
