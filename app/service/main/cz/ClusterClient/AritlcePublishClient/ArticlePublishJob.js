const Base = require('sdk-base');
const schedule = require('node-schedule');
const moment = require('moment');

class ArticlePublishJob extends Base{
    constructor(articleId, date, publishFunc) {
        super({
            initMethod: 'init'
        });
        this.articleId = articleId;
        this.date = date;
        this._publish = publishFunc;
        this.job = null;
        this.done = false;
    }

    async init(){
        this.job = await this.createTimer(this.date);
    }
    async createTimer(date){
        if(date.getTime() <= Date.now()){
            this.done = true;
            await this.publish();
            return null;
        }
        else
            return schedule.scheduleJob(date,this.publish.bind(this))
    }

    async publish(){
        this.done = true;
        await this._publish(this.articleId);
        this.emit('done');
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

    getArticleId(){
        return this.articleId;
    }


}

module.exports = ArticlePublishJob;
