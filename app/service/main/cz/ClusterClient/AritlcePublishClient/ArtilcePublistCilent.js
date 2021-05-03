const APIClientBase = require('cluster-client').APIClientBase;
const ArticlePublishClientBase = require('./ArticlePublishClientBase');

class ArticleDelayedPublishClient extends APIClientBase {

    // 返回原始的客户端类
    get DataClient() {
        return ArticlePublishClientBase;
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

    async createJob(articleId,date,callback){
        try{
            return await this._client.createJob(articleId,date,callback);
        }
        catch (error) {
            //TODO 防止不可预料的错误
            throw error;
        }
    }

    async setCtx(ctx){
        return await this._client.setCtx(ctx);
    }

    async cancel(articleId){
        return await this._client.cancel(articleId);
    }

    async setJobDate(articleId,date){
        return await this._client.setJobDate(articleId,date)
    }

    async setJob(articleId, date){
        return await this._client.setJob(articleId, date);
    }

    async getJobList(articleId,date){
        return await this._client.getJobList()
    }


}
module.exports = ArticleDelayedPublishClient;
