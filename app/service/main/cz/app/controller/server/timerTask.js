const Controller = require('../../core/controller/ApiController');

class TimerTaskController extends Controller {

    async add(){
        try{
            await this.service.clusterClient.timerTask.add();
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }



}

module.exports = TimerTaskController;
