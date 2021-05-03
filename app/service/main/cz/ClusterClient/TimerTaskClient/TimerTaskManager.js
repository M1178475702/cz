const Base = require('sdk-base');
const TimerTask = require('./TimerTask');

class TimerTaskManager extends Base {
    constructor(config) {
        super({
            initMethod: 'init'
        });
        this.channels = new Map();
        this.agent = config.agent;
    }

    async init() {}

    //task  可以是任意参数，在egg以外，还可以是函数
    async addTimerTask(channel_name, id, date, task) {

        let channel = this.getChannel(channel_name);
        let timerTask;
        if (!channel) {
            channel = new Map();
            this.channels.set(channel_name, channel);
            timerTask = await this.createTimerTask(channel_name, id, date, this.onTime.bind(this, task));
            channel.set(id, timerTask);
        } else {
            timerTask = channel.get(id);
            if(timerTask){
                return {
                    error_code: 1,
                    error_msg: 'id已存在'
                }
            }
            else {
                timerTask = await this.createTimerTask(channel_name, id, date, this.onTime.bind(this, task));
                channel.set(id, timerTask);
            }
        }

        timerTask.once('done', function(channel_name, id){
            const channel = this.getChannel(channel_name);
            channel.delete(id);
        }.bind(this));
        return {
            error_code: 0,
            error_msg: ''
        }
    }

    async createTimerTask(channel_name, id, date, callback) {
        const task = new TimerTask(channel_name, id, date, callback);
        await task.ready();
        return task;
    }

    async cancel(channel_name, id) {
        const timerTask = this.getTimeTask(channel_name, id);
        if (!timerTask) return;
        timerTask.cancel();
        const channel = this.getChannel(channel_name, id);
        channel.delete(id);
    }

    async setTimerTaskDate(channel_name, id, date) {
        const timerTask = this.getTimeTask(channel_name, id);
        if (!timerTask) return;
        await timerTask.resetDate(date);
    }


    getChannel(channel_name) {
        return this.channels.get(channel_name)
    }

    getTimeTask(channel_name, id) {
        const channel = getChannel;
        return channel.get(id);
    }

    //可重写该函数
    onTime(task) {
        if (typeof task === 'string' || typeof task === 'object')
            this.agent.messenger.sendRandom('TIMER_TASK', task);
        else if (typeof task === 'function')
            task();
    }

}

module.exports = TimerTaskManager;
