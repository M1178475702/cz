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
            const user_list = await this.ctx.app.model.XdXdUser.findAll({
                where: {
                    user_id: {$gte: 10009}
                },
                attributes: ['user_id','user_number']
            });
            for(const user of user_list){
                const user_number = this.service.user.common.generateUserNumber(user.get('user_id'));
                await user.update({
                    user_number: user_number
                },{
                    transaction: t
                });
                // throw  TypeError('e');
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
