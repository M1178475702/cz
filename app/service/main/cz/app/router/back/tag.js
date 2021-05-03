module.exports = app => {
    const { router, controller } = app;
    const backapi = controller.back;
    const base_path = '/back/tag';
    //后台录入

    router.get(base_path + '/list',backapi.tag.getTagList);

    router.get(base_path + '/:id',backapi.tag.getTagInfo);

    router.post(base_path,backapi.tag.createTag);

    router.delete(base_path,backapi.tag.deleteTag);

    router.patch(base_path,backapi.tag.editTag);

    router.get(base_path + '/rel/list',backapi.tag.getTagRelTagList);

    router.post(base_path + '/rel',backapi.tag.createTagRel);

    router.delete(base_path + '/rel',backapi.tag.cancelRelTagToTag);

    router.patch(base_path + '/rel',backapi.tag.editRelTag);

    router.get(base_path + '/class/list',backapi.tag.getTagClassAndTagList);

    router.post(base_path + '/class/rel',backapi.tag.createTagClassRel);


};
