const Service = require('../../../core/service/ApiService');

class Topic extends Service {

    async getTopicList(options){
        const dao = this.service.topic.back.dao;
        options.offset  = options.pn * options.ps;
        const topic_list = await dao.topic.getTopicList(options);
        const promises = topic_list.map(async (topic)=>{
            await this.getCreator(topic);
        });
        await Promise.all(promises);
        const count = await dao.topic.getTopicCount(options);
        return {
            list: topic_list,
            count: count,
            pn: options.pn,
            ps: options.ps
        }
    }



    async getCreator(topic){
        if(topic.creator_type === this.constant.TOPIC_CREATOR_TYPE.USER){
            const user = await this.service.user.common.findUserObjById(topic.created_by);
            topic.creator_name = user.name;
        }
        else if(topic.creator_type === this.constant.TOPIC_CREATOR_TYPE.ADMIN){
            const admin = await this.service.admin.common.getAdminById(topic.created_by);
            topic.creator_name = admin.account;
        }
    }

    async createTopic(topicInfo){
        const t = await this.getTransaction();
        try{
            const dao = this.service.topic.back.dao;
            await dao.topic.createTopic(topicInfo);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async updateTopicInfo(topicInfo){
        const t = await this.getTransaction();
        try{
            const dao = this.service.topic.back.dao;
            const topic = await dao.topic.getTopicByTopicId(topicInfo.topic_id);
            if(!topic) throw new this.error.CommonError('not found topic');
            if(topic.status === this.constant.TOPIC_STATUS.CAN_VIEW_COMMENT && topicInfo.status !== this.constant.TOPIC_STATUS.CAN_VIEW_COMMENT)
                topicInfo.end_time = new Date(this.ctx.starttime);
            await dao.topic.updateTopicInfo(topicInfo);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async updateTopicStatus(topic_id, status){
        const t = await this.getTransaction();
        try{
            const dao = this.service.topic.back.dao;
            const topic = await dao.topic.getTopicByTopicId(topic_id);
            let end_time;
            if(topic.status === this.constant.TOPIC_STATUS.CAN_VIEW_COMMENT && status !== this.constant.TOPIC_STATUS.CAN_VIEW_COMMENT)
                end_time = new Date(this.ctx.starttime);
            await dao.topic.updateTopicStatus(topic_id, status, end_time);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}
module.exports = Topic;
