const Service = require('../core/service/ApiService');
const moment = require('moment');

class ExpService extends Service{
    //修改经验
    async editExp(userId,value,reason){
        const t = this.getTransaction();
        try{
            const user = await this.model.XdXdUser.findOne({ where:{user_id: userId}, transaction:t});
            user.set('exp',user.get('exp') + value);
            const level = user.get('level'),
                exp = user.get('exp');

            await this.model.XdXdUser.update(
                {
                    exp: this.model.literal(`exp + ${value}`)
                },
                {
                    where:{user_id: userId}, transaction:t
                }
            );
            await this.model.XdXdRecordExp.create(
                {
                    user_id: userId,
                    value: value,
                    reason: reason
                },
                {transaction:t}
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }
}
module.exports = ExpService;
