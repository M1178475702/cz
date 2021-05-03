const Service = require('../../core/service/ApiService');

class Topic extends Service {

    async getTopicByTopicId(topic_id){
        return this.service.topic.dao.getTopicByTopicId(topic_id);
    }

}

module.exports = Topic;
