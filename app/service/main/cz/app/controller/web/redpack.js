const Controller = require('../../core/controller/ApiController');

class WebRedPackController extends Controller{

    async sendSingleRedPack(){
        try{
            this.result.data = await this.service.redpack.articleInsideRedPack.send(this.ctx.session.userId);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }

    }

}
module.exports = WebRedPackController;


