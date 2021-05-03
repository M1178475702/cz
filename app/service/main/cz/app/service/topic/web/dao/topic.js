const Service = require('../../../../core/service/ApiService');

class TopicDao extends Service {


    async getTopicList(offset, ps, order) {
        //can : 1 yes 2 no
        const self = this;
        const query = this.knex
            .select('topic.topic_id','title', 'cover', 'content', 'views_count', 'reply_count', 'coll_count', 'create_time')
            .from({topic: 'xd_xd_topic'})
            .join(function () {
                const subQuery = this
                    .select('topic.topic_id')
                    .from({topic: 'xd_xd_topic'})
                    .whereBetween('status', [self.constant.TOPIC_STATUS.CAN_VIEW_COMMENT, self.constant.TOPIC_STATUS.CAN_VIEW_NOT_COMMENT])
                    .offset(offset)
                    .limit(ps)
                    .as('ids');
                if(order === 'new')
                    subQuery
                        .orderBy('create_time', 'DESC')
                        .orderBy('coll_count', 'DESC')
                        .orderBy('views_count', 'DESC');
                else if('order' === 'hot')
                    subQuery
                        .orderBy('coll_count', 'DESC')
                        .orderBy('views_count', 'DESC')
                        .orderBy('create_time', 'DESC');
            }, 'topic.topic_id', 'ids.topic_id');
        if(order === 'new')
            query
                .orderBy('create_time', 'DESC')
                .orderBy('coll_count', 'DESC')
                .orderBy('views_count', 'DESC');
        else if('order' === 'hot')
            query
                .orderBy('coll_count', 'DESC')
                .orderBy('views_count', 'DESC')
                .orderBy('create_time', 'DESC');


        const sql = query.toString();
        return this.model.query(sql, {type: this.model.QueryTypes.SELECT});
    }

    async getTopicByTopicId(topic_id) {
        return this._getTopicByTopicId(
            topic_id, true,
            ['topic_id', 'title', 'cover', 'content', 'create_time', 'coll_count', 'reply_count', 'views_count', 'status', 'create_time']
        )
    }

    async createTopic(topicInfo) {
        const t = this.getTransaction();
        try {
            await this.model.XdXdTopic.create({
                content: topicInfo.content,
                cover: topicInfo.cover,
                begin_time: topicInfo.begin_time,
                end_time: topicInfo.end_time,
                created_by: topicInfo.created_by
            }, {
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async _getTopicByTopicId(topic_id, raw = false, attributes) {
        const findOpt = {
            where: {
                topic_id: topic_id,
                status: {$in: [this.constant.TOPIC_STATUS.CAN_VIEW_COMMENT, this.constant.TOPIC_STATUS.CAN_VIEW_NOT_COMMENT]}
            }
        };
        if (attributes)
            findOpt.attributes = attributes;
        if (raw)
            findOpt.raw = raw;
        return this.model.XdXdTopic.findOne(findOpt);
    }

    async incrementTopicViewsCount(topic_id, value) {
        await this.updateTopic(topic_id, 'views_count', this.model.literal(`views_count + ${value}`));
    }

    async incrementTopicReplyCount(topic_id, value) {
        await this.updateTopic(topic_id, 'reply_count', this.model.literal(`reply_count + ${value}`));
    }

    async incrementTopicCollCount(topic_id, value) {
        await this.updateTopic(topic_id, 'coll_count', this.model.literal(`coll_count + ${value}`));
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
