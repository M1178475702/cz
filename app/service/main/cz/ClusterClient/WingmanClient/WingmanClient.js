const APIClientBase = require('cluster-client').APIClientBase;
const WingmanClientBase = require('./WingmanClientBase');

class WingmanClient extends APIClientBase {

    // 返回原始的客户端类
    get DataClient() {
        return WingmanClientBase;
    }

    // 用于设置 cluster-client 相关参数，等同于 cluster 方法的第二个参数
    get clusterOptions() {
        return {
            responseTimeout: 240 * 1000,  //内部socket请求leader响应最大timeout，超过这个客户端会关闭socket
            heartbeatInterval: 80000      //80秒心跳 240秒检查一次
        };
    }

    subscribe(reg, listener) {
        this._client.subscribe(reg, listener);
    }

    publish(reg) {
        this._client.publish(reg);
    }

    async doTask(task,args){
        try{
            return await this._client.scheduleTask(task,args)
        }
        catch (error) {
            //TODO 防止不可预料的错误
            throw error;
        }

    }

    async wingmanCount(){
        return await this._client.wingmanCount();
    }

    async restart(){
        return await this._client.restart()
    }

    async isCanWork(){
        return await this._client.isCanWork()
    }

    async runningCount(){
        return await this._client.runningCount()
    }

    async leftTaskCount(){
        return await this._client.leftTaskCount()
    }

}
module.exports = WingmanClient;
