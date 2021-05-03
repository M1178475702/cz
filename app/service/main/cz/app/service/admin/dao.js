const Service = require('../../core/service/ApiService');


class AdminDao extends Service {

    async getAdminById(admin_id){
        return this.model.XdXdAdmin.findOne({where: {admin_id: admin_id}});
    }
}
module.exports = AdminDao;
