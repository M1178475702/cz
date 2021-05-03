const Base = require('sdk-base');
const schedule = require('node-schedule');
const moment = require('moment');

class TimerTask extends Base{
    constructor(channel, id, date, task) {
        super(Object.assign({
            channel,
            id,
            date,
            task
        }, {
            initMethod: 'init'
        }));
    }

    async init(){
        this.channel = this.options.channel;
        this.id = this.options.id;
        this.date = this.options.date;
        this.task = this.options.task;
        this.done = false;
        this.job = await this.createTimer(this.date);
    }

    async createTimer(date){
        if(date.getTime() <= Date.now()){
            this.done = true;
            await this.do();
            return null;
        }
        else
            return schedule.scheduleJob(date, this.do.bind(this));
    }

    async do(){
        this.done = true;
        await this.task();
        this.emit('done', this.channel, this.id);
    }

    cancel(){
        this.job.cancel();
    }

    async resetDate(date){
        if(date.getTime() <= Date.now){
            this.done = true;
            this.cancel();
            await this.publish();
        }
        else{
            this.date = date;
            this.job.reschedule(date);
        }
    }

    getDate(){
        return moment(this.date).format('YYYY-MM-DD HH:MM:ss');
    }


}

module.exports = TimerTask;
