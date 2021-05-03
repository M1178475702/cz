const Service = require('../../../core/service/ApiService');

class SelectService extends Service{

    async getAppAccessToken(){
        const wxapp = this.app.wxapps.getApp(11);
        return await wxapp.getWxAppAccessToken();
    }

}

module.exports = SelectService;
