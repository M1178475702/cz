const Service = require('../../../core/service/ApiService');

class ReplyService extends Service {

    async addReply(replyInfo) {
        const t = await this.getTransaction();
        try {
            const dao = this.service.reply.web.dao;
            const topic = await this.service.topic.common.getTopicByTopicId(replyInfo.origin_id);
            if (!topic)
                throw new this.error.CommonError('not found origin');
            const promises = this.helper.getPromises();
            replyInfo.status = 1;   //默认启用
            promises.push(dao.reply.addTopicReply(replyInfo));
            topic.set('reply_count', this.model.literal(`reply_count + 1`));
            promises.push(topic.save({transaction: t}));
            if (replyInfo.root_id) {
                promises.push(dao.reply.incrementReplyCount(replyInfo.root_id)) ;
            }
            await promises.execute();
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async getRootReplyWithSubReplyList(options) {
        const dao = this.service.reply.web.dao;
        const list = await dao.reply.getRootReplyListByTopicId(options.origin_id, options.type, options.lm, options.ps);
        const promises = list.map(async (reply)=>{
            reply.replies = await dao.reply.getSubReplyListByRootId(reply.reply_id, 0, 2);
            if(this.ctx.session.userId)
                reply.is_like = await this.service.reply.web.like.isLike(this.ctx.session.userId, reply.reply_id);
            else
                reply.is_like = false;
        });
        await Promise.all(promises);
        return {
            replies: list,
            pn: options.pn,
            ps: options.ps
        }
    }

    async getSubReplyList(options) {
        const dao = this.service.reply.web.dao;
        const list = await dao.reply.getSubReplyListByRootId(options.reply_id, options.pn * options.ps, options.ps);
        const promises = list.map(async (reply)=>{
            if(this.ctx.session.userId)
                reply.is_like = await this.service.reply.web.like.isLike(this.ctx.session.userId, reply.reply_id);
            else
                reply.is_like = false;
        });
        await Promise.all(promises);
        return {
            replies: list,
            pn: options.pn,
            ps: options.ps
        }
    }
}

module.exports = ReplyService;
