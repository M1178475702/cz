const Controller = require('../../core/controller/ApiController');

class InternalController extends Controller {

    async getAppAccsessToken(){
        try{

            this.result.data = await this.service.wxapp.internal.select.getAppAccessToken();
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }



}

module.exports = InternalController;
