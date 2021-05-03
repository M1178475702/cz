module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/topic';

    router.get(base_path + '/list' ,webapi.topic.getTopicList);

    router.get(base_path, webapi.topic.getTopicByTopicId);


};
