const Base = require('sdk-base');
const constant = require('../../app/common/constant/xd-constant');
const ArticlePublishJob = require('./ArticlePublishJob');


class ArticlePublishJobManager extends Base {
    constructor(options) {
        super({
            initMethod: 'init'
        });
        this.jobs = new Map();
        this.agent = options.agent;
    }

    async init() {}

    async setJob(articleId, date) {
        let isExist = this.getJob(articleId);
        if (!isExist) {
            const job = await this.createJob(articleId, date,this.onTime.bind(this));
            if (!job.done) {
                this.jobs.set(articleId, job);
                job.once('done', () => {
                    this.jobs.delete(articleId);
                })
            }
        } else {
            await this.setJobDate(articleId, date);
        }
    }

    async createJob(articleId, date, callback) {
        const job = new ArticlePublishJob(articleId, date, callback);
        await job.ready();
        return job;
    }

    async cancel(articleId) {
        const job = this.getJob(articleId);
        if (!job) return;
        job.cancel();
        this.jobs.delete(articleId);
    }

    async setJobDate(articleId, date) {
        const job = this.getJob(articleId);
        if (!job) return;
        await job.resetDate(date);
    }

    async getJobList() {
        const list = [];
        for (let job of this.jobs) {
            list.push({
                articleId: job.getArticleId(),
                date: job.getDate()
            })
        }
        return list;
    }

    getJob(articleId) {
        return this.jobs.get(articleId);
    }

    onTime(articleId){
        this.agent.messenger.sendRandom('article_delayed_publish',articleId);
    }

}

module.exports = ArticlePublishJobManager;
