const Subscription = require('egg').Subscription;

class UserData extends Subscription {

    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            immediate: true,
            type: 'worker', // 指定所有的 worker 都需要执行
            disable: true
        };
    }

    async subscribe() {
        const t = await this.ctx.app.model.transaction();
        try {
            const model = this.ctx.app.model;
            const list = await model.XdXdRecordRankViewDuration.findAll({
                where: {
                    snapshot_time: {
                        $gte: new Date('2019-06-06 00:00:00')
                    }
                },
                order:[['view_duration','DESC']],
                raw: true
            });
            for (let ele of list) {
                if(ele.view_duration !== 0)
                await model.XdXdRankViewDuration.update(
                    {
                        view_duration: ele.view_duration
                    },
                    {
                        where: {user_id: ele.user_id},
                        raw: true,
                        transaction: t
                    })
            }
            await t.commit();
        }
        catch (error) {
            this.ctx.logger.error(error);
            await t.rollback();
        }

    }

}

module.exports = UserData;
