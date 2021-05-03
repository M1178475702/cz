const Service = require('../../core/service/ApiService');
const xdUtil = require('../../helper/xd-util.js');


class AdminService extends Service {
    async getAdminById(admin_id){
        return this.service.admin.dao.getAdminById(admin_id);
    }
}
module.exports = AdminService;
