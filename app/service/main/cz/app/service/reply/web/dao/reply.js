const Service = require('../../../../core/service/ApiService');

class TopicReplyDao extends Service {

    //回复
    async addTopicReply(replyInfo) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdReply.create({
                origin_id: replyInfo.origin_id,
                type: this.constant.REPLY_ORIGIN_TYPE.TOPIC,
                user_id: replyInfo.user_id,
                content: replyInfo.content,
                created_by: replyInfo.created_by,
                parent_id: replyInfo.parent_id,
                root_id: replyInfo.root_id,
                status: replyInfo.status
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
    //增加回复的回复数
    async incrementReplyCount(topic_reply_id, value = 1){
        await this.updateTopicReply(topic_reply_id, 'reply_count', this.model.literal(`reply_count + ${value}`))
    }
    //更新回复
    async updateTopicReply(reply_id, props, values){
        const t = await this.getTransaction();
        try{
            if(typeof props === 'string'){
                props = [props];
                values = [values];
            }
            const attrs = {};
            let i = 0;
            for(const prop of props){
                attrs[prop] = values[i++];
            }
            await this.model.XdXdReply.update(attrs,{
                where: {
                    reply_id: reply_id,
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
    //获取父评论列表
    async getRootReplyListByTopicId(origin_id, type, lm, ps) {
        lm = this.helper.getYMDhms(lm);
        const query = this.knex
            .select('reply.reply_id', 'reply.content', 'reply.reply_count', 'reply.like_count', 'reply.create_time')
            .select('user.user_id',{username: 'user.name'}, {user_avatar: 'user.avatar'})
            .from({reply: 'xd_xd_reply'})
            .join({user: 'xd_xd_user'}, 'user.user_id', 'reply.user_id')
            .where('reply.origin_id', '=', origin_id)
            .where('reply.root_id', '=', 0)
            .where('reply.type', '=', type)
            .where('create_time', '<', lm)
            .limit(ps)
            .orderBy('create_time', 'DESC');
        const sql = query.toString();
        return this.model.query(sql, {type: this.model.QueryTypes.SELECT});
    }
    //获取子评论
    async getSubReplyListByRootId(root_id, offset, ps) {
        const query = this.knex
            .select('reply.reply_id', 'reply.content',  'reply.reply_count', 'reply.like_count', 'reply.create_time' ,'reply.root_id','reply.parent_id')
            .select('user.user_id', {username: 'user.name'}, {user_avatar: 'user.avatar'})
            .from({reply: 'xd_xd_reply'})
            .join({user: 'xd_xd_user'}, 'user.user_id', 'reply.user_id')
            .where('reply.root_id', '=', root_id)
            .offset(offset)
            .limit(ps)
            .orderBy('like_count', 'DESC')    //TODO 没有父评论，所以顺序并不重要
            .orderBy('create_time', 'DESC');
        const sql = query.toString();
        return this.model.query(sql, {type: this.model.QueryTypes.SELECT});
    }

}

module.exports = TopicReplyDao;
