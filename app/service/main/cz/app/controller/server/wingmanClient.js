const Controller = require('../../core/controller/ApiController');
class WingmanClientController extends Controller {
    async getWingmanClientStatus(){
        try{
            this.result.data = await this.service.clusterClient.wingmanClient.getWingmanClientStatus();
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }

    async restart(){
        try{
            this.result.data = await this.service.clusterClient.wingmanClient.restart();
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }

    async test(){
        try{
            await this.service.clusterClient.wingmanClient.test();
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }



}

module.exports = WingmanClientController;
