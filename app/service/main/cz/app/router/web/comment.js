module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/comment';

    router.post(base_path + '/do',webapi.comment.addComment);

    router.get(base_path + '/list',webapi.comment.getCommentList);

    router.put(base_path + '/:id/like',webapi.comment.doLike);


};
