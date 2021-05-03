module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/reply';

    router.get(base_path + '/list' ,webapi.reply.getRootReplyWithSubReplyList);

    router.get(base_path + '/sub/list', webapi.reply.getSubReplyList);

    router.post(base_path + '/add', webapi.reply.addReply);

    router.post(base_path + '/like', webapi.reply.doLike);

};
