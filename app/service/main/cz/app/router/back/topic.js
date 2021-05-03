module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.back;
    const base_path = '/back/topic';

    router.get(base_path + '/list' ,webapi.topic.getTopicList);

    router.post(base_path + '/create', webapi.topic.createTopic);

    router.post(base_path + '/update/status', webapi.topic.updateTopicStatus);

    router.post(base_path + '/update', webapi.topic.updateTopicInfo);

};
