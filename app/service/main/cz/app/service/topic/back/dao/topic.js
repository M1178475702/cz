const Service = require('../../../../core/service/ApiService');

class TopicDao extends Service {

    async createTopic(topicInfo) {
        const t = await this.getTransaction();
        try {
            const topic = await this.model.XdXdTopic.create({
                title: topicInfo.title,
                content: topicInfo.content,
                cover: topicInfo.cover,
                created_by: topicInfo.created_by,
                creator_type: this.constant.TOPIC_CREATOR_TYPE.ADMIN,
                status: topicInfo.status
            }, {
                transaction: t
            });
            await this.commit();
            return topic;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async getTopicByTopicId(topic_id) {
        return this.model.XdXdTopic.findOne({
            where: {
                topic_id: topic_id
            },
            raw: true
        });
    }

    async getTopicList(options) {
        const query = this.knex
            .select('topic.topic_id', 'title', 'cover', 'content', 'views_count', 'reply_count', 'coll_count', 'create_time', 'status')
            .select('topic.created_by', 'topic.creator_type')
            .from({topic: 'xd_xd_topic'})
            .join(
                function () {
                    const subQuery = this
                        .select('topic.topic_id')
                        .from({topic: 'xd_xd_topic'})
                        .offset(options.offset)
                        .limit(options.ps)
                        .as('ids');
                    if (options.topic_id)
                        subQuery.where('topic_id', '=', options.topic_id);
                    if (options.status)
                        subQuery.where('status', '=', options.status);
                    if (options.title)
                        subQuery.where('title', 'like',`%${options.title}%`);
                    subQuery
                        .orderBy('create_time', 'DESC')
                        .orderBy('coll_count', 'DESC')
                        .orderBy('views_count', 'DESC');
                },
                'topic.topic_id', 'ids.topic_id'
            );
        query
            .orderBy('create_time', 'DESC')
            .orderBy('coll_count', 'DESC')
            .orderBy('views_count', 'DESC');

        const sql = query.toString();
        return this.model.query(sql, {type: this.model.QueryTypes.SELECT});
    }

    async getTopicCount(options){
        const query = this.knex
            .count({count: 'topic_id'})
            .from({topic: 'xd_xd_topic'});
        if (options.topic_id)
            query.where('topic_id', '=', options.topic_id);
        if (options.status)
            query.where('status', '=', options.status);
        if (options.title)
            query.where('title', 'like',`%${options.title}%`);
        const sql = query.toString();
        const result = await this.model.query(sql, {type: this.model.QueryTypes.SELECT});
        return result[0].count;
    }

    async updateTopicStatus(topic_id, status, end_time) {
        const props = ['status'];
        const values = [status];
        if (end_time) {
            props.push('end_time');
            values.push(end_time);
        }
        await this.updateTopic(topic_id, props, values);
    }

    async updateTopicInfo(topicInfo) {
        const props = ['title', 'cover', 'content', 'status'];
        const values = [topicInfo.title, topicInfo.cover, topicInfo.content, topicInfo.status];
        if (topicInfo.end_time) {
            props.push('end_time');
            values.push(topicInfo.end_time);
        }
        await this.updateTopic(topicInfo.topic_id, props, values);
    }

    async updateTopic(topic_id, props, values) {
        const t = await this.getTransaction();
        try {
            if (typeof props === 'string') {
                props = [props];
                values = [values];
            }
            const attrs = {};
            let i = 0;
            for (const prop of props) {
                attrs[prop] = values[i++];
            }
            await this.model.XdXdTopic.update(attrs, {
                where: {
                    topic_id: topic_id,
                },
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }
}

module.exports = TopicDao;
