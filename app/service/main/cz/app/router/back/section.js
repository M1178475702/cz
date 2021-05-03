module.exports = app => {
    const { router, controller } = app;
    const backapi = controller.back;
    const base_path = '/back/section';
    //后台录入

    router.get(base_path + '/list',backapi.section.getSectionList);
};
