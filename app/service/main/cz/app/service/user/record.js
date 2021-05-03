const Service = require('../../core/service/ApiService');
const moment = require('moment');


class UserService extends Service {

    //创建用户登录记录
    async createRecordUserLogin(userId, ip, src) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdRecordUserLogin.create(
                {
                    user_id: userId,
                    ip: ip,
                    login_src: src
                },
                {transaction: t}
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }
    //用户操作记录
    async createRecordUserOp(userId, opType) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdRecordUserOp.create({
                    user_id: userId,
                    op_type: opType
                },
                {transaction: t});
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}

module.exports = UserService;
