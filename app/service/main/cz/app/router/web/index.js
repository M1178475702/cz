module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/index';

    router.get(base_path ,webapi.index.getIndexContent);

    router.get(base_path + '/section' ,webapi.index.getIndexSectionContent);

    router.get(base_path + '/newest', webapi.index.getIndexNewestArticleList);

    router.get(base_path + '/hot', webapi.index.getIndexHotArticleList);

};
