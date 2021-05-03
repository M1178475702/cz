const Subscription = require('egg').Subscription;

/**
 * @description 同步所有排行榜记录
 */
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

            // helper.farawayDays()
            // const user_id_list = await model.XdXdRankViewDuration.findAll({
            //     where: {
            //         user_id: {$between: [10001,10008]}
            //     },
            //     attributes: ['user_id'],
            //     raw: true
            // });
            const user_id_list = [];
            for(let i = 0;i < 8;++i)
                user_id_list.push(10001 + i)
            const promises = user_id_list.map(async(user_id)=>{
                let sum_obj = await model.XdXdRecordArticleView.findOne({
                    where: {
                        user_id: user_id,
                        create_time: {
                            $between: ['2019-07-25 03:00:00','2019-08-01 03:00:00']
                        }
                    },
                    attributes: [['user_id','userId'],[model.literal('sum(duration_time)'),'sum']],
                    order:[[model.literal('sum(duration_time)'),'DESC']],
                    group: ['user_id'],
                    raw: true
                });
                if(!sum_obj)
                    sum_obj = {sum: 0};

                await model.XdXdRankViewDuration.create({
                    user_id: user_id,
                    view_duration: sum_obj.sum,
                    rank: 2
                },{
                    transaction: t
                });
                // await model.XdXdRankViewDuration.update({
                //     view_duration: sum_obj.sum
                // },{
                //     where: {
                //         user_id: user_id.user_id,
                //     },
                //     transaction: t
                // })
            });

            await Promise.all(promises);
            await t.commit();
        }
        catch (error) {
            this.ctx.logger.error(error);
            await t.rollback();
        }

    }

}

module.exports = UserData;
