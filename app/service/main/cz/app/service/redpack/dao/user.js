const Service = require('../../../core/service/ApiService');

class UserDao extends Service {

    async getUserIdListByUN(user_number_list){
        return this.model.XdXdUser.findAll({
            where: {
                user_number: {$in: [user_number_list]}
            },
            attributes: ['user_id'],
            raw: true
        })
    }
}

module.exports = UserDao;
