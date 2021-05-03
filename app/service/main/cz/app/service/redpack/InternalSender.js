const Service = require('../../core/service/ApiService');
const BasicSender = require('./BasicRedPack');

class InternalService extends BasicSender {

    async sendByOpenId(openId, red_pack_id){
        const t = await this.getTransaction();
        try{
            const dao = this.service.redpack.dao;
            const user = await this.service.user.common.findUserByOpenid(openId);
            if(!user)
                throw new this.error.InvalidError(`不存在的用户 ${openId}`);
            const red_pack = await dao.redpack.getRedPackById(red_pack_id);
            if(!red_pack)
                throw new this.error.InvalidError(`用户红包异常操作：无效的红包 user_id: ${user.user_id}  red_pack_id ${red_pack_id}`);
            if(!this.isEnable(red_pack))
                throw new this.error.InvalidError(`用户红包异常操作：user_id: ${user.user_id} 原因：无效的红包`);

            const send_res = await this.singleSend(red_pack,user);

            if (send_res.error_code === this.constant.RED_PACK_SEND_ERR_CODE.USER_ERROR)
                throw new this.error.CommonError(send_res.error_msg);
            if (send_res.error_code === this.constant.RED_PACK_SEND_ERR_CODE.ACCOUNT_ERROR) {
                throw new this.error.CommonError('系统繁忙，请稍后再试');
            } else if (send_res.error_code === this.constant.RED_PACK_SEND_ERR_CODE.INTERNAL_ERROR) {
                throw new this.error.CommonError('系统繁忙，请稍后再试');
            }
            await this.commit();
            return {
                amount: send_res.amount,
                msg: '您的红包已发放，如未收到请等待，若长时间没有响应，请联系管理员'
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }


}

module.exports = InternalService;
