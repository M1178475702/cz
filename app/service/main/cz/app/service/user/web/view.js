const Service = require('../../../core/service/ApiService');

class UserService extends Service {

    //获取个人用户信息
    async getSelfUserInfo() {
        if (this.ctx.session.status !== 2)
            throw new this.error.PermissionError('没有授权');
        return await this.getClientUserInfo(this.ctx.session.userId);
    }

    //获取用户信息
    async getClientUserInfo(userId) {
        const userInfo = await this.model.XdXdViClientUser.findOne({
            where: {userId: userId},
            attributes: ['username', 'mobile', 'avatar', 'level', 'exp', 'bonusPoints', 'levelName', 'collCount', 'commentCount', 'viewCount'],
            raw: true
        });
        if (!userInfo)
            throw new this.error.InvalidError('无效用户id');

        //下一级
        const nextLevel = await this.model.XdXdUserLevel.findOne({
            where: {level_id: userInfo.level + 1},
            attributes: ['required_exp'], raw: true
        });
        if (nextLevel) userInfo.levelPercent = (userInfo.exp / nextLevel.required_exp);
        else userInfo.levelPercent = 1;
        return userInfo;
    }


}

module.exports = UserService;
