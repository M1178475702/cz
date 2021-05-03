const Service = require('../../../../core/service/ApiService');

class ReplyDao extends Service {

    async getHotReplyById(topic_id) {
        const query = this.knex
            .select('reply.reply_id', 'reply.content', 'reply.reply_count', 'reply.like_count', 'reply.create_time')
            .select('user.user_id', {username: 'user.name'}, {user_avatar: 'user.avatar'})
            .from({reply: 'xd_xd_reply'})
            .join({user: 'xd_xd_user'}, 'user.user_id', 'reply.user_id')
            .where('reply.origin_id', '=', topic_id)
            .where('reply.root_id', '=', 0)
            .where('reply.type', '=', this.constant.REPLY_ORIGIN_TYPE.TOPIC)
            .limit(1)
            .orderBy('like_count', 'DESC')
            .orderBy('create_time', 'DESC');
        const sql = query.toString();
        const reply_list = await this.model.query(sql, {type: this.model.QueryTypes.SELECT});
        return reply_list[0] || null;
    }
}

module.exports = ReplyDao;
