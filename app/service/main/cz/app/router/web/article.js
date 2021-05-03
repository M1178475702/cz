module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/article';

    router.get(base_path + '/newest', webapi.article.getNewestArticleList);

    router.get(base_path + '/hot', webapi.article.getHotArticleList);

    //获取文章列表，可指定排序方式，以及板块，支持分页
    router.get(base_path + '/list', webapi.article.getWebArticleList);

    router.get(base_path + '/heat', webapi.article.getWebHeatArticleList);

    router.get(base_path + '/newestId', webapi.article.getNewestArticleId);
    //按照板块获取文章列表
    router.get(base_path + '/list/section',webapi.article.getArticleListBySection);

    router.get(base_path + '/list/unread',webapi.article.getUserUnreadArticleList);

    router.get(base_path + '/list/interested',webapi.article.getUserInterestedArticleList);

    //TODO 占位符的URL尽量靠后
    //提交态度
    router.put(base_path + '/:id/attitude',webapi.article.doAttitude);

    //更新浏览时间
    router.patch(base_path + '/:id/upViewDur',webapi.article.updateViewDuration);
    //分享
    router.post(base_path + '/:id/share',webapi.article.doShare);

    //根据id获取文章详情
    router.get(base_path + '/:id', webapi.article.getWebArticleDetail);

};

