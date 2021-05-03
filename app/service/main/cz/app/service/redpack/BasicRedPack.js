const Service = require('../../core/service/ApiService');

class BasicRedPack extends Service {

    //TODO 职责仅限于发送，不包括多于的鉴权判断机制
    async singleSend(red_pack, user) {
        return this._send(red_pack, user);
    }

    //TODO 确保不会抛错，以免影响batchSend
    async _send(red_pack, user) {
        let result;
        let send_flag = 0;
        try{
            const dao = this.service.redpack.dao;
            const promises = this.helper.getPromises();
            promises.push(this.getAmount(red_pack, red_pack.amount));
            promises.push(this.generateMchBillNumber(user.user_id));
            let [amount, mch_billno] = await promises.execute();

            //判断普通还是裂变
            if (red_pack.type === this.constant.RED_PACK_TYPE.COMMON) {
                this.logger.info(user.openid, mch_billno, amount * 100, 1, red_pack.act_name, red_pack.remark, red_pack.wishing, red_pack.send_name);
                result = await this.app.redpack.sendCommonRedPack(
                    user.openid, mch_billno, amount * 100, 1, red_pack.act_name, red_pack.remark, red_pack.wishing, red_pack.send_name
                );
            }
            else if (red_pack.type === this.constant.RED_PACK_TYPE.FISSION) {
                //裂变红包
            }

            const handled_result = await this.handleResult(result);
            //成功或等待
            if (handled_result.error_code === this.constant.RED_PACK_SEND_ERR_CODE.NONE || handled_result.error_code === this.constant.RED_PACK_SEND_ERR_CODE.AWAIT) {
                //先将余额减下
                send_flag = 1;
                await dao.redpack.decrease(red_pack.red_pack_id, 1, amount);
                const record = await dao.record.createSendRecord(user.user_id, red_pack.red_pack_id, mch_billno, amount, handled_result.error_code);
                handled_result.amount = amount;
                if (handled_result.error_code === this.constant.RED_PACK_SEND_ERR_CODE.AWAIT) {
                    //TODO 创建轮询
                    this.ctx.logger.error(`红包发送结果未知，准备轮询\n发送结果：\n${JSON.stringify(handled_result)}\n record_id: ${record.record_id}`);
                    send_flag = 2;
                    await this.setTimerTask(red_pack.red_pack_id, record.record_id, user.user_id, amount, mch_billno);
                }
            }
            else {
                this.ctx.logger.error(`红包发送失败\n发送结果：\n${JSON.stringify(handled_result)}\n user_id: ${user.user_id}`)
            }
            return handled_result;
        }
        catch (error) {
            //捕捉依赖包及可能抛出的异常
            //没有成功发送，各种原因
            if(!send_flag){
                this.ctx.logger.error(`由于未知异常红包发送失败失败，错误：\n${error.message}\\n${error.stack}`);
                return {
                    error_code: 51,
                    error_msg: error.message
                }
            }// 成功发送红包,但是后续代码出错，此时，需要通知日志，及返回给前端发送成功
            else if(send_flag === 1){
                //TODO 紧急错误，需要立刻修复，及暂停红包发放
                this.ctx.logger.error(`红包发送成功但后续失败，错误：\n${error.message}\n${error.stack}`);
                //TODO 异常推送
                return {
                    error_code: 0,
                    error_msg: error.message
                }
            }//等待红包发送结果，后续出错
            else if(send_flag === 2){
                //TODO 紧急错误，需要立刻修复，及暂停红包发放
                this.ctx.logger.error(`红包发送成功但后续失败，错误：\n${error}`);
                //TODO 异常推送
                return {
                    error_code: 0,
                    error_msg: error.message
                }
            }
        }
    }

    async handleResult(result) {
        if (result.err_code === 'SUCCESS') {
            //成功
            return {
                error_code: this.constant.RED_PACK_SEND_ERR_CODE.NONE,
                error_msg: ""
            }
        } else if (result.err_code === 'SYSTEMERROR') {
            //TODO 加入定时任务，轮询，重新查询订单
            this.ctx.logger.warn(`重新查询订单号： ${result.mch_billno}`);
            return {
                error_code: this.constant.RED_PACK_SEND_ERR_CODE.AWAIT,
                error_msg: '系统忙，请耐心等待或联系管理员'
            }
        } else if (result.err_code === 'SENDNUM_LIMIT') {
            //TODO  已经领取过了 用户方错误，需返回给用户提示
            return {
                error_code: this.constant.RED_PACK_SEND_ERR_CODE.USER_ERROR,
                error_msg: '达到今日领取上限'
            };
        } else if (result.err_code === 'NOTENOUGH') {
            //TODO 系统或账号内部原因错误，账户余额不足，需提醒管理员（内部通过日志，或者推送）

            return {
                error_code: this.constant.RED_PACK_SEND_ERR_CODE.ACCOUNT_ERROR,
                error_msg: result.err_code_des
            };
        } else if (result.err_code === 'SENDAMOUNT_LIMIT') {

            return {
                error_code: this.constant.RED_PACK_SEND_ERR_CODE.ACCOUNT_ERROR,
                error_msg: result.err_code_des
            };
        } else {

            return {
                error_code: this.constant.RED_PACK_SEND_ERR_CODE.INTERNAL_ERROR,
                error_msg: `unhandled error msg is ${result.err_code_des}`
            }
        }
    }

    async getAmount(red_pack, amount) {
        if (red_pack.amount_strategy === this.constant.RED_PACK_AMOUNT_STRATEGY.RANDOM) {
            const [low, high] = amount.split(',');
            //更详细的金额控制
            return this.helper.random(parseFloat(low), parseFloat(high)).toFixed(2);   //分为单位
        }
        else {
            return parseFloat(amount);
        }
    }

    async isEnable(red_pack) {
        //TODO  还需要检查开始时间，截止时间，后续加上
        return !(red_pack.status === this.constant.RED_PACK_STATUS.DISABLE
            || red_pack.status === this.constant.RED_PACK_STATUS.DRAIN  //这个状态不需要了
            || red_pack.status === this.constant.RED_PACK_STATUS.END
            || red_pack.remain_count <= 0
            || red_pack.total_amount <= 0
            || new Date(red_pack.begin_time).getTime() > Date.now()
            || new Date(red_pack.end_time).getTime() < Date.now()
        );
    }

    async generateMchBillNumber(user_id) {
        //28位
        // CZtsN13user_idNu_lenRanStr
        // CZ + timestamp + U + user_id + Z + fill_str
        user_id = user_id.toString();
        let str = 'CZ';
        const max_length = 28;
        const timestamp = Date.now().toString();
        str = str + timestamp + 'U' + user_id + 'Z';
        str += await this.ctx.helper.generateString(max_length - str.length);
        return str;
    }

    //询问订单情况
    async querySendRecord(red_pack_id, record_id, mch_billno) {
        //ask
        const send_res = await this.app.redpack.queryRedPackRecord(mch_billno);
        let resend_flag = false;
        if (send_res.return_code === 'SUCCESS') {
            if (send_res.result_code === 'SUCCESS') {
                //成功与否需要看status,但此时已确认发送
                if (send_res.status === 'RECEIVED') {
                    return {
                        error_code: 0,
                        error_msg: ''
                    }
                }//发放中，需继续查询
                else if (send_res.status === 'SENDING') {
                    return {
                        error_code: 91,
                        error_msg: '发送中'
                    }
                }
                //失败
                else if (send_res.status === 'FAILED') {
                    return {
                        error_code: 101,
                        error_msg: send_res.reason
                    }
                }  //退款
                else if (send_res.status === 'RFUND_ING' || send_res.status === 'REFUND') {
                    return {
                        error_code: 102,
                        error_msg: '该红包退款处理'
                    }
                }

            } //系统繁忙，需要继续查询
            else if (send_res.error_code === 'SYSTEMERROR') {
                return {
                    error_code: 10,
                    error_msg: '系统繁忙'
                }
            }
        } else {
            //请求参数出错，需检查
            this.ctx.logger.error(`红包查询出错   ${send_res.return_msg}`)
        }
    }

    async pollQuery(red_pack_id, record_id, user_id, amount, mch_billno) {

        const query_res = await this.querySendRecord(red_pack_id, record_id, mch_billno);
        const dao = this.service.redpack.dao;

        if (!query_res.error_code) {
            //成功，成功处理
            await dao.record.updateStatus(record_id, query_res.error_code);
        }//系统繁忙，或发送中
        else if (query_res.error_code === 10 || query_res.error_code === 91) {
            //如果仍需等待，ttl为最多询问次数
            await dao.record.updateStatus(record_id, query_res.error_code);
            await this.setTimerTask(red_pack_id, record_id, user_id, amount, mch_billno);
        } //退款
        else if(query_res.error_code === 101 || query_res.error_code === 102){
            await dao.redpack.increase(red_pack_id, 1, amount);
            await dao.record.updateStatus(record_id, query_res.error_code);
        }
        else {
            //确认失败，通知管理员处理
            await dao.redpack.increase(red_pack_id, 1, amount);
            await dao.record.updateStatus(record_id, query_res.error_code);
            this.ctx.logger.error(`record_id: ${record_id}, user_id: ${user_id}, mch_billno: ${mch_billno} 红包发放失败，请管理员手动查询`)
        }
    }

    async setTimerTask(red_pack_id, record_id, user_id, amount, mch_billno){
        const channel_name = 'query_red_pack_record';
        const date = new Date(Date.now() + 120000);   //2分钟
        const task = {
            service: ['redpack', 'BasicRedPack'],
            method: 'pollQuery',
            args: [red_pack_id, record_id, user_id, amount, mch_billno]
        };
        await this.app.timerTaskClient.addTimerTask(channel_name, record_id, date, task);
    }

}

module.exports = BasicRedPack;
