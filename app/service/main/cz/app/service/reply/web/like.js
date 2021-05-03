const Service = require('../../../core/service/ApiService');

class ReplyLikeService extends Service {

    async doLike(user_id, reply_id){
        const t = await this.getTransaction();
        try{
            let result = true;
            const dao = this.service.reply.web.dao;
            const like_Obj = await dao.like.getLike(user_id,reply_id);
            if(!like_Obj){
                await dao.like.addLike(user_id, reply_id);
                await dao.like.incrementReplyLikeCount(reply_id, 1);
            }
            else if(like_Obj.status === this.constant.LIKE_STATUS.LIKE){
                await dao.like.dislike(like_Obj.like_id);
                await dao.like.incrementReplyLikeCount(reply_id, -1);
                result = false;
            }
            else if(like_Obj.status === this.constant.LIKE_STATUS.DISLIKE){
                await dao.like.like(like_Obj.like_id);
                await dao.like.incrementReplyLikeCount(reply_id, 1);
            }
            await this.commit();
            return {
                is_like: result
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async isLike(user_id, reply_id){
        const dao = this.service.reply.web.dao;
        const like_Obj = await dao.like.getLike(user_id,reply_id);
        return like_Obj && like_Obj.status === this.constant.LIKE_STATUS.LIKE;
    }

}

module.exports = ReplyLikeService;
