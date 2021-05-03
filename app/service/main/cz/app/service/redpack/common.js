const Service = require('../../core/service/ApiService');

class Common extends Service {

    constructor(prop) {
        super(prop);

    }

    //产生商户订单号



    async setAmount(red_pack_id, low, high) {
        await this.model.XdXdRedPack.update({
            amount: `${low},${high}`
        }, {
            where: {
                red_pack_id: red_pack_id
            }
        })
    }

    async getAmountRangeById(red_pack_id) {
        const red_pack = await this.model.XdXdRedPack.findOne({
            where: {
                red_pack_id: red_pack_id
            },
            attributes: ['amount']
        });
        const [low, high] = red_pack.amount.split(',');
        return {
            low: low,
            high: high
        }
    }

    async getRedPackById(red_pack_id) {
        return this.model.XdXdRedPack.findOne({
            where: {
                red_pack_id: red_pack_id
            }
        });
    }


}

module.exports = Common;
