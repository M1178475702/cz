const APIClientBase = require('cluster-client').APIClientBase;
const TimerTaskManager = require('./TimerTaskManager');

class TimerTaskManagerClient extends APIClientBase {

    // 返回原始的客户端类
    get DataClient() {
        return TimerTaskManager;
    }

    // 用于设置 cluster-client 相关参数，等同于 cluster 方法的第二个参数
    get clusterOptions() {
        return {
            responseTimeout: 60 * 1000,  //内部socket请求leader响应最大timeout，超过这个客户端会关闭socket
            heartbeatInterval: 30000      //80秒心跳 240秒检查一次
        };
    }

    subscribe(reg, listener) {}

    publish(reg) {}

    async addTimerTask(channel_name, id, date, task){
        try{
            return await this._client.addTimerTask(channel_name, id, date, task);
        }
        catch (error) {
            //TODO 防止不可预料的错误
            throw error;
        }
    }

    async cancel(articleId){
        return await this._client.cancel(articleId);
    }

    async setTimerTaskDate(articleId,date){
        return await this._client.setTimerTaskDate(articleId,date)
    }

}
module.exports = TimerTaskManagerClient;
