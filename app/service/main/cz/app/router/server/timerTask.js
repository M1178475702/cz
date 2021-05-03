module.exports = app => {
    const { router, controller } = app;
    const server = controller.server;
    const server_path = '/server/timer';

    router.post(server_path + '/add',server.timerTask.add);

};
