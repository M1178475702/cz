module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/wxapp';

    router.get(base_path + '/signature',webapi.wxapp.getSignatureConfig);

};
