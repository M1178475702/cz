const Controller = require('../../core/controller/ApiController');

class InternalController extends Controller {

    async sendByOpenId(){
        try{
            const rule = {
                redPackId: 'int',
                openId: 'string'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            this.result.data = await this.service.redpack.internalSender.sendByOpenId(body.openId, body.redPackId);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }
}

module.exports = InternalController;
