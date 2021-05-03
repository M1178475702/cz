const Service = require('../../core/service/ApiService');

class Topic extends Service {

    async getTopicByTopicId(topic_id){
        return this.model.XdXdTopic.findOne({
            where: {
                topic_id: topic_id
            }
        });
    }


}

module.exports = Topic;
