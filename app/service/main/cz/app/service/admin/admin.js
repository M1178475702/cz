const Service = require('../../core/service/ApiService');
const xdUtil = require('../../helper/xd-util.js');


class AdminService extends Service {

  async login(account,password){
    function makeMd5Pwd(pwd) {
      for(let i = 0;i < 3;++i){
        pwd = xdUtil.md5(pwd)
      }
    }

    const { model } = this.app;
    const admin = await model.XdXdAdmin.findOne({
      where:{account: account, pwd: password},
      raw:true
    });
    if(!admin)
      throw new this.error.PermissionError('账号不存在或密码不正确');
    if(admin.status === 0)
      throw new this.error.PermissionError('该账号已被禁用');

    this.ctx.session.adminId = admin.admin_id;
    this.ctx.session.account = admin.account;
    this.ctx.session.name = admin.name;
    //初期全部为超管
    this.ctx.session.role = 1;

    return {
      name:admin.name,
      role:this.ctx.session.role
    }
  }
}

module.exports = AdminService;
