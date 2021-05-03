const Subscription = require('egg').Subscription;

class Bonus_points_rank extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            immediate: true,
            type: 'worker', //只有一个worker执行
            // disable:true
        };
    }

    async subscribe(){
        try{
            const list = await this.ctx.service.article.back.view.getDelayedPublishArticleIds();
            for (const article of list) {
                await this.ctx.app.articlePublishClient.setJob(article.article_id, article.publish_time);
            }
        }
        catch (error) {
            this.ctx.logger.error(error);
            throw error;
        }

    }
}
module.exports = Bonus_points_rank;
