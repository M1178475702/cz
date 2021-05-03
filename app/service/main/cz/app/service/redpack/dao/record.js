const Service = require('../../../core/service/ApiService');

class RedPackSendRecord extends Service {

    async createSendRecord(user_id, red_pack_id, mch_billno, amount, status) {
        const t = await this.getTransaction();
        try {
            const record = await this.model.XdXdRecordRedPackSend.create({
                user_id: user_id,
                red_pack_id: red_pack_id,
                mch_billno: mch_billno,
                amount: amount,
                status: status
            }, {
                transaction: t
            });
            await this.commit();
            return record;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async getRecordByUserIdAndDate(user_id, ps, begin, end) {
        const findOpt = {
            where: {
                user_id: user_id
            },
            order: [['create_time', 'DESC']],
        };
        if (ps)
            findOpt.limit = ps;
        if (begin && !end) {
            findOpt.where.create_time = {$gte: begin};
        } else if (begin && !end) {
            findOpt.where.create_time = {$lte: begin};
        } else if (begin && end) {
            findOpt.where.create_time = {$between: [begin, end]}
        }
        return await this.model.XdXdRecordRedPackSend.findAll(findOpt);
    }

    async updateStatus(record_id, status){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdRedPack.update({
                status: status
            },{
              where: {
                  record_id: record_id
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

module.exports = RedPackSendRecord;
