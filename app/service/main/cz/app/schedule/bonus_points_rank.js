const Subscription = require('egg').Subscription;

class Bonus_points_rank extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 0 3 ? * 4', // 每周四早上三点执行
            // immediate: true,
            type: 'worker', //只有一个worker执行
            disable:true
        };
    }

    async subscribe(){
        const t = await this.ctx.app.model.transaction();
        try{
            await this.ctx.service.userRank.bonusPointsRank.saveSnapshotBonusPointsRank(t);
            await this.ctx.service.userRank.bonusPointsRank.resetCurRankList(t);
            await t.commit();
        }
        catch (error) {
            this.ctx.logger.error(error);
            await t.rollback();
        }

    }
}
module.exports = Bonus_points_rank;
