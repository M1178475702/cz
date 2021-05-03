module.exports = app => {
    const { router, controller } = app;
    const backapi = controller.back;
    const base_path = '/back/comment';
    //后台录入

    router.get(base_path + '/list',backapi.comment.getCommentList);

    router.post(base_path + '/:id/audit',backapi.comment.auditComment);
};
