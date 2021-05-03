const Subscription = require('egg').Subscription;

class UpdateWxapp extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '7000s', // 7000s 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            disable: true
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        try{
            await this.app.wxapps.getApp(11).setWxAppAccessToken();
            await this.app.wxapps.getApp(11).setWxAppJsApiTicket();
        }
        catch (error) {
            this.ctx.logger.error(error);
            throw error;
        }
    }
}

module.exports = UpdateWxapp;
