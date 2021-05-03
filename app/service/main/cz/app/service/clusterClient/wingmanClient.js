const Service = require('../../core/service/ApiService');
const xdutil = require('../../helper/xd-util.js');


class WingmanClientService extends Service {

    async getWingmanClientStatus(){
        try{
            const [isCanWork,runningCount,leftTaskCount,wingmanCount] = await Promise.all([
                this.app.wingmanClient.isCanWork(),
                this.app.wingmanClient.runningCount(),
                this.app.wingmanClient.leftTaskCount(),
                this.app.wingmanClient.wingmanCount()
            ]);
            return {
                isCanWork: isCanWork,
                runningCount: runningCount,
                leftTaskCount: leftTaskCount,
                wingmanCount: wingmanCount
            }
        }
        catch (error) {
            throw error;
        }
    }

    async test(){
        try{
            return await this.app.wingmanClient.doTask('block',[3]);
        }
        catch (error) {
            throw error;
        }
    }


    async restart(){
        try{
            await this.app.wingmanClient.restart();
            return await this.getWingmanClientStatus();
        }
        catch (error) {
            throw error;
        }

    }

}

module.exports = WingmanClientService;
