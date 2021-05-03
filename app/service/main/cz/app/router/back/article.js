module.exports = app => {
    const { router, controller } = app;
    const backapi = controller.back;
    const base_path = '/back/article';
    //后台录入
    router.post(base_path + '/input',backapi.article.inputArticleByReprint);

    router.patch(base_path + '/:id/edit',backapi.article.editArticle);

    router.get(base_path + '/auditorList',backapi.article.getAuditorArticleList);

    router.get(base_path + '/:id',backapi.article.getAuditorArticleDetail);

    router.post(base_path + '/dupcheck',backapi.article.duplicateCheck);

};
