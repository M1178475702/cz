const Controller = require('../../core/controller/ApiController');

class InternalController extends Controller {

    async login(){
        try{
            const rule = {
                wxcode: 'string'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            this.ctx.logger.info(body);
            this.result.data = await this.service.user.internal.login.loginFromOtherSystem(body.wxcode, body.from);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }



}

module.exports = InternalController;
