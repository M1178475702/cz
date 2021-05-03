const Service = require('../../../core/service/ApiService');

class RedPackDao extends Service {

    async getRedPackById(red_pack_id) {
        return this.model.XdXdRedPack.findOne({
            where: {
                red_pack_id: red_pack_id
            }
        });
    }

    async decrease(red_pack_id, total_num, amount) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdRedPack.update({
                remain_count: this.model.literal(`remain_count - ${total_num}`),
                remain_amount: this.model.literal(`remain_amount - ${amount}`)
            }, {
                where: {
                    red_pack_id: red_pack_id
                },
                transaction: t
            });

            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async increase(red_pack_id, total_num, amount) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdRedPack.update({
                remain_count: this.model.literal(`remain_count + ${total_num}`),
                remain_amount: this.model.literal(`remain_amount + ${amount}`)
            }, {
                where: {
                    red_pack_id: red_pack_id
                },
                transaction: t
            });

            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async createReaPack(act_name, remark, type, amount_strategy, status, max_count, total_amount, amount, wishing, begin_time, end_time, created_by) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdRedPack.create({
                act_name: act_name,
                remark: remark,
                type: type,
                amount_strategy: amount_strategy,
                status: status,
                max_count: max_count,
                amount: amount,
                wishing: wishing,
                begin_time: begin_time,
                end_time: end_time,
                created_by: created_by,
                remain_amount: total_amount,
                total_amount: total_amount
            }, {
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async update(red_pack_id, updateAttr) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdRedPack.update({
                act_name: updateAttr.act_name,
                remark: updateAttr.remark,
                type: updateAttr.type,
                amount_strategy: updateAttr.amount_strategy,
                status: updateAttr.status,
                max_count: updateAttr.max_count,
                amount: updateAttr.amount,
                wishing: updateAttr.wishing,
                begin_time: updateAttr.begin_time,
                end_time: updateAttr.end_time,
                remain_amount: updateAttr.remain_amount,
                total_amount: updateAttr.total_amount
            }, {
                where: {
                    red_pack_id: red_pack_id
                },
                transaction: t
            });

            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}

module.exports = RedPackDao;

