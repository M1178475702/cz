const Service = require('../../core/service/ApiService');
const xdutil = require('../../helper/xd-util.js');

class TimerTaskService extends Service {

    async add() {

        const date = new Date(Date.now() + 1000 * 10);   //十秒后
        const channel_name = 'test';
        const task = {
            service: ['clusterClient', 'timerTask'],
            method: 'test_timer',
            args: [1, 2, 3]
        };
        this.ctx.logger.error(`ADD TIMER TASK DATE: ${new Date()}`);
        const result = await this.app.timerTaskClient.addTimerTask(channel_name, 1, date, task);
        console.log(result);

    }

    async test_timer(_1, _2, _3) {
        console.log(_1, _2, _3);
        this.ctx.logger.error(`EXECUTE TIMER TASK DATE: ${new Date()}`);
    }

}

module.exports = TimerTaskService;
