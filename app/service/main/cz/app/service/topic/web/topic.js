const Service = require('../../../core/service/ApiService');

class Topic extends Service {

    async getTopicList(options) {
        const dao = this.service.topic.web.dao;
        const list = await dao.topic.getTopicList(options.pn * options.ps, options.ps, options.order);
        const promises = list.map(async (topic)=>{
            topic.reply = await dao.reply.getHotReplyById(topic.topic_id);
        });
        await Promise.all(promises);
        return {
            list: list,
            ps: options.ps,
            pn: options.pn
        }
    }

    async getTopicByTopicId(topic_id) {
        const dao = this.service.topic.web.dao;
        const topic = await dao.topic.getTopicByTopicId(topic_id);
        if (!topic) {
            throw new this.error.CommonError('不存在该主题');
        }
        await dao.topic.incrementTopicViewsCount(topic_id, 1);
        topic.is_collected = false;
        if (this.ctx.session.userId){
            topic.is_collected = await this.service.collection.rpc.isCollected(topic_id, this.constant.COLLECTION_TYPE.TOPIC, this.ctx.session.userId);
        }
         return topic;
    }

}

module.exports = Topic;
