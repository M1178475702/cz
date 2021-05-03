const Service = require('../../../core/service/ApiService');

class UserService extends Service {

    //更新用户信息
    async updateUserInfo(userId, userInfo) {
        const t = await this.getTransaction();
        try {
            const updateAttr = {
                name: userInfo.username,
            };
            await this.model.XdXdUser.update(
                updateAttr,
                {where: {user_id: userId}, transaction: t});
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //绑定手机号
    async bindMobile(userId, mobile) {
        const t = await this.getTransaction();
        try {
            let user = await this.service.user.common.findUserByMobile(mobile);
            if (user)
                throw new this.error.InvalidError('该手机号已被注册');
            user = await this.service.user.common.findUserObjById(userId);
            if (!user)
                throw new this.error.InvalidError('无效用户');
            if (user.get('mobile') && user.get('mobile').length > 0)
                throw new this.error.InvalidError('不可重新绑定');
            await user.update({mobile: mobile}, {transaction: t});
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

}

module.exports = UserService;
