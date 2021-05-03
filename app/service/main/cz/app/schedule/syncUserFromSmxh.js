const Subscription = require('egg').Subscription;
const mysql = require('mysql2/promise');

/**
 * @description 将触梦杯注册用户同步到user
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
        const model = this.ctx.app.model;
        const t = await model.transaction();
        try {
            const connection = await mysql.createConnection({
                host: '47.98.146.46',
                user: 'smxh_dt',
                password: 'smxh_dt@123456',
                database: 'smxh_dt_prod',
                port: 33061
            });

            let results = await connection.query('SELECT * from helper_info where create_time >= \'2019-09-23 00:27:36\'');
            results = results[0];
            console.log(`should be sync user count ${results.length}`);
            let complete_count = 0;
            const promises = results.map(async (user_info)=>{
                //检查openid 是否已经注册  打印序号
                const isExist = await model.XdXdUser.findOne({
                    where: {
                        openid: user_info.wx_open_id
                    }
                });
                if(!isExist){
                    const user = await model.XdXdUser.create(
                        {
                            openid: user_info.wx_open_id,
                            name: user_info.wx_nickname,
                            avatar: user_info.wx_avatar,
                            gender: 0,
                            status: this.ctx.app.constant.USER_STATUS.AUTHENTICATED,                            //授权
                            user_role: this.ctx.app.constant.USER_ROLE.STUDENT,
                        },
                        {transaction: t, raw: true}
                    );
                    const user_number = this.service.user.common.generateUserNumber(user.get('user_id'));
                    await user.update({
                        user_number: user_number
                    },{
                        transaction: t
                    });
                    console.log(`completed ${++complete_count}`);
                }
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
