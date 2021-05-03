module.exports = app => {
    const { router, controller } = app;
    const server = controller.server;
    const server_path = '/server/wingman';

    router.post(server_path + '/restart',server.wingmanClient.restart);
    router.get(server_path + '/status',server.wingmanClient.getWingmanClientStatus);

    router.get(server_path + '/test',server.wingmanClient.test);

};
