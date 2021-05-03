const Service = require('../../core/service/ApiService');
const moment = require('moment');


class UserService extends Service {

    async getUserMobile(userId) {
        const user = await this.model.XdXdUser.findOne({
            where: {user_id: userId},
            attributes: ['mobile'],
            raw: true
        });
        return user.mobile;
    }

    async findUserByOpenid(openid) {
        return await this.app.model.XdXdUser.findOne({where: {openid: openid}});
    }

    async findUserByMobile(mobile) {
        return await this.model.XdXdUser.findOne({where: {mobile: mobile}});
    }

    async findUserObjById(userId) {
        return await this.model.XdXdUser.findOne({where: {user_id: userId}});
    }

    generateUserNumber(user_id){
        const prefix = 'CZ';

        const length = 8;
        const base = this.ctx.helper.base18(user_id);
        let code = prefix;
        let i = length - base.length;
        while (i--){
            code += '0'
        }
        code += base;
        return code;
    }

}

module.exports = UserService;
