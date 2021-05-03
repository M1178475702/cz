'use strict';
const Service = require('../../core/service/ApiService');


class BonusPointsService extends Service {

    async editBonusPoints(user, reason, value) {
        try {
            if (!this.ctx.helper.isObject(user))
                user = await this.service.user.common.findUserObjById(user);
            if (!user) throw new this.error.InvalidError('无效用户');
            const userId = user.get('user_id');
            switch (reason) {
                case this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_DO_ATTITUDE:
                    await this._editBonusPoints(userId, value, this.constant.BONUS_POINTS_OP_TYPE.INCREASE, reason);
                    break;
                case this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_DO_SHARE:
                    await this._editBonusPoints(userId, value, this.constant.BONUS_POINTS_OP_TYPE.INCREASE, reason);
                    break;
                case this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_SINGLE_READ_TIME_SPENT_20:
                    await this._editBonusPoints(userId, value, this.constant.BONUS_POINTS_OP_TYPE.INCREASE, reason);
                    break;
                case this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_DO_COMMENT:
                    await this._editBonusPoints(userId, value, this.constant.BONUS_POINTS_OP_TYPE.INCREASE, reason);
                    break;
                default:
                    throw new this.error.InvalidError('无效编辑积分原因');
            }
            const role = user.get('user_role');
            if (role === this.constant.USER_ROLE.STUDENT || role === this.constant.USER_ROLE.TEACHER)
                await this.service.userRank.bonusPointsRank.updateBonusPointsRank(userId, value);
            return value;
        }
        catch (error) {
            throw error;
        }
    }

    async getTodaySumOfAddedPoints(user_id){
        const today = this.ctx.helper.farawayDays(0);

        const sum_obj = await this.model.XdXdRecordBonusPoints.findOne({
            where: {
                user_id: user_id,
                create_time: {$gte: today}
            },
            attributes: [[this.model.literal(`sum(value)`),'sum']],
            raw: true
        });
        return sum_obj.sum ? sum_obj.sum : 0;
    }

    async getReasonCount(userId, reason, begin, end) {
        end = end || new Date();
        const where = {user_id: userId, create_time: {$lte: end}};
        let reasonCount = 0;
        if (begin)
            where.create_time.$gte = begin;
        const records = await this.model.XdXdRecordBonusPoints.findAll({
            where: where, raw: true
        });
        //统计总分，及指定原因总数
        for (let record of records) {
            if (record.reason === reason)
                ++reasonCount;
        }
        return reasonCount;
    }

    //修改积分
    async _editBonusPoints(userId, value, optype, reason) {
        const t = await this.getTransaction();
        try {
            //收入/支出
            let literal;
            if (optype === this.constant.BONUS_POINTS_OP_TYPE.INCREASE)
                literal = `bonus_points + ${value}`;
            else if (optype === this.constant.BONUS_POINTS_OP_TYPE.REDUCE)
                literal = `bonus_points - ${value}`;
            //修改
            await this.model.XdXdUser.update(
                {bonus_points: this.model.literal(literal)},
                {where: {user_id: userId}, transaction: t}
            );
            await this.model.XdXdRecordBonusPoints.create(
                {user_id: userId, value: value, op_type: optype, reason: reason},
                {transaction: t}
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }
}

module.exports = BonusPointsService;
