const BasicSender = require('./BasicRedPack');
const ACTIVITY_ONE_RED_PACK = 10;

class ActivityOneSenderService extends BasicSender {

    //TODO 该接口暂时还无法使用，事务问题,或者，不建议当成接口使用需要要先解决事
    async send(user_number){
        const t = await this.getTransaction();
        try{
            const dao = this.service.redpack.dao;
            const promises = this.helper.getPromises();
            promises.push(dao.redpack.getRedPackById(ACTIVITY_ONE_RED_PACK));
            promises.push(dao.user.getUserIdListByUN(user_number));
            const [red_pack, user_id] = await promises.execute();
            //TODO 暂时采用堵塞写法
            const user = await this.service.user.common.findUserObjById(user_id);
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
                msg: '发放成功'
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }


    //TODO 该接口暂时还无法使用，事务问题,或者，不建议当成接口使用需要要先解决事
    async batchSend(user_number_list){
        const t = await this.getTransaction();
        try{
            const dao = this.service.redpack.dao;
            const red_pack = await dao.getRedPackById(ACTIVITY_ONE_RED_PACK);
            const user_id_list = await dao.user.getUserIdListByUN(user_number_list);
            const results = [];
            //TODO 暂时采用堵塞写法
            for(const user_id of user_id_list){
                const user = await this.service.user.common.findUserObjById(user_id);
                const send_res = await this.singleSend(red_pack, user);
                if(!(await this.isCanReceive(red_pack, user))){
                    this.ctx.logger.warn(`用户红包异常操作：user_id: ${user_id}`);
                    results.push({
                        error_code: 1,
                        error_message: `用户红包异常操作：user_id: ${user_id}`,
                        user_id: user_id
                    })
                }
                else {
                    send_res.user_id = user.user_id;
                    results.push(send_res);
                }
            }
            //TODO 为了避免多个异步操作时事务出现混乱，暂时不用这种并发写法

            // const promises = user_id_list.map(async (user_id) => {
            //     const user = await this.service.user.common.findUserObjById(user_id);
            //     const send_res = await this.singleSend(red_pack, user);
            //     if(!(await this.isCanReceive(red_pack, user))){
            //         this.ctx.logger.warn(`用户红包异常操作：user_id: ${user_id}`);
            //         results.push({
            //             error_code: 1,
            //             error_message: `用户红包异常操作：user_id: ${user_id}`,
            //             user_id: user_id
            //         })
            //     }
            //     else {
            //         send_res.user_id = user.user_id;
            //         results.push(send_res);
            //     }
            // });
            // await Promise.all(promises);
            await this.commit();
            return results;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async isCanReceive(red_pack, user) {
        if(!(await this.isEnable(red_pack))){
            this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：无效的红包`);
            return false;
        }
        if(!user){
            this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：不存在用户`);
            return false;
        }
        if (!user.status === this.constant.USER_STATUS.AUTHENTICATED){
            this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：未授权`);
            return false;
        }

        //只能领取一次
        const begin = new Date('2019-09-10 00:00:00');
        const record_list = await this.service.redpack.record.getRecordByUserIdAndDate(user.user_id, 1, begin);
        if (record_list.length && (record_list[0].status === this.constant.RED_PACK_SEND_ERR_CODE.NONE
            || record_list[0].status === this.constant.RED_PACK_SEND_ERR_CODE.AWAIT)){
            this.ctx.logger.error(`用户红包异常操作：user_id: ${user.user_id} 原因：超过今日领取次数`);
            return false;
        }
        return true;
    }


    async getAmount(red_pack, amount) {
        // 再根据需求处理一下
        if (red_pack.amount_strategy === this.constant.RED_PACK_AMOUNT_STRATEGY.RANDOM) {
            const [low, high] = amount.split(',');
            //根据当前剩余余额，剩余红包个数，决定概率偏向
            return this.helper.random(parseFloat(low), parseFloat(high)).toFixed(2) * 100;   //分为单位
        } else {
            return parseFloat(amount).toFixed(2) * 100;
        }

    }

}

module.exports = ActivityOneSenderService;
