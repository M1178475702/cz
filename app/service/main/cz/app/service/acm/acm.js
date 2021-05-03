const Service = require('../../core/service/ApiService');
const moment = require('moment');

class ExpService extends Service {
    //修改经验
    async createAcmUser(options) {
        const t = await this.getTransaction();
        try {
            await this.model.XdAcmUser.create({
                acm_id: options.acm_id,
                name: options.name,
                sex: options.sex,
                user_number: options.user_number,
                birth_date: options.birth_date,
                academy: options.academy,
                class_room: options.class_room,
                phone_trombone: options.phone_trombone,
                phone_cornet: options.phone_cornet,
                hobby: options.hobby,
                speciality: options.speciality,
                synopsis: options.synopsis,
                remark: options.remark
            },{
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

module.exports = ExpService;
