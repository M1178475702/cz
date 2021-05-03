module.exports = app => {
    const {router, controller} = app;
    const webapi = controller.web;
    const base_path = '/web/collection';

    router.get(base_path + '/list', webapi.collection.getCollectionList);

    router.post(base_path + '/do', webapi.collection.doCollect);

    router.delete(base_path + '/undo', webapi.collection.undoCollect);

};
