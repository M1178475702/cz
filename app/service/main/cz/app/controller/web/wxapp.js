const Controller = require('../../core/controller/ApiController');

class CommentController extends Controller {
    async getSignatureConfig(){
        try{
            const rule = {
                url:'string'
            };
            this.validate(rule,this.ctx.request.query);
            this.result.data = await this.app.wxapps.getApp(11).getWxAppApiTicketSignature(this.ctx.request.query.url);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = CommentController;
