const BasicRedPack = require('./BasicRedPack');
const ARTICLE_RED_PACK_ID = 11;

class ArticleInsideRedPackService extends BasicRedPack {

    //interface
    async send(user_id) {
        const t = await this.getTransaction();
        try {
            const dao = this.service.redpack.dao;
            const promises = this.helper.getPromises();
            promises.push(dao.redpack.getRedPackById(ARTICLE_RED_PACK_ID));
            promises.push(this.service.user.common.findUserObjById(user_id));
            const [red_pack, user] = await promises.execute();
            //检查是否可以领取，包括红包是否启用，用户是否有权限，今天是否领取过
            if (!(await this.isCanReceive(red_pack, user))) {
                throw new this.error.CommonError('非正常操作')
            }
            const send_res = await this.singleSend(red_pack, user);
            if (send_res.error_code === this.constant.RED_PACK_SEND_ERR_CODE.USER_ERROR) {
                throw new this.error.CommonError(send_res.error_msg);
            }
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

    //用户是否可以领取
    async isCanReceive(red_back, user, isLog = true) {
        if (!(await this.isEnable(red_back))) {
            if(isLog)
                this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：无效的红包`);
            return false;
        }
        if (!user) {
            if(isLog)
                this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：不存在用户`);
            return false;
        }
        if (!user.status === this.constant.USER_STATUS.AUTHENTICATED) {
            if(isLog)
                this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：未授权`);
            return false;
        }

        const begin = this.helper.farawayDays();
        const record_list = await this.service.redpack.record.getRecordByUserIdAndDate(user.user_id, ARTICLE_RED_PACK_ID, begin);
        if (record_list.length &&
            (record_list[0].status === this.constant.RED_PACK_SEND_ERR_CODE.NONE
                || record_list[0].status === this.constant.RED_PACK_SEND_ERR_CODE.AWAIT)) {
            if(isLog)
                this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：超过今日领取次数`);
            return false;
        }
        return true;
    }

    //判断是否出现红包
    async isAppearRedPack(user_id) {
        const dao = this.service.redpack.dao;
        const promises = this.helper.getPromises();
        promises.push(dao.redpack.getRedPackById(ARTICLE_RED_PACK_ID));
        promises.push(this.service.user.common.findUserObjById(user_id));
        const [red_pack, user] = await promises.execute();
        if (!(await this.isCanReceive(red_pack, user, false)))
            return false;
        const begin = this.helper.farawayDays();
        const article_record_list = await this.service.article.record.getUserViewRecordList(user_id, 10, begin);
        if (article_record_list.length >= 3)
            return true;
        else if (article_record_list.length < 3) {
            const random = Math.ceil(this.helper.random(1, 3));
            return random >= 2;
        }
    }

    async getAmount(red_pack, amount) {
        // 再根据需求处理一下

        if (red_pack.amount_strategy === this.constant.RED_PACK_AMOUNT_STRATEGY.RANDOM) {
            const [low, high] = amount.split(',');
            if (red_pack.remain_count === 1) {
                return red_pack.remain_amount < high ? red_pack.remain_amount : high;
            } else
                return this.helper.random(parseFloat(low), parseFloat(high)).toFixed(2);
        } else {
            return parseFloat(amount).toFixed(2);
        }
    }

}

module.exports = ArticleInsideRedPackService;
