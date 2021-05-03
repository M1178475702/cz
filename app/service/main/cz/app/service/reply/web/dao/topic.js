const Service = require('../../../../core/service/ApiService');

class TopicDao extends Service {

    async getTopicByTopicId(topic_id, attributes){
        const findOpt = {
            where: {
                origin_id: topic_id
            }
        };
        if(attributes)
            findOpt.attributes = attributes;
        return this.model.XdXdTopic.findOne(findOpt);
    }
}

module.exports = TopicDao;
