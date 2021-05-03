const Service = require('../../../../core/service/ApiService');

class TopicReplyDao extends Service {

    async getLike(user_id, reply_id) {
        return this.model.XdXdLike.findOne({
            where: {
                user_id: user_id,
                item_id: reply_id,
                type: this.constant.LIKE_ITEM_TYPE.REPLY
            }
        })
    }

    async addLike(user_id, reply_id) {
        const t = await this.getTransaction();
        try{
            const like = await this.model.XdXdLike.create({
                user_id: user_id,
                item_id: reply_id,
                type: this.constant.LIKE_ITEM_TYPE.REPLY,
                status: this.constant.LIKE_STATUS.LIKE,

            },{
                transaction: t
            });
            await this.commit();
            return like;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async dislike(like_id) {
        const t = await this.getTransaction();
        try{
            await this.model.XdXdLike.update({
                status: this.constant.LIKE_STATUS.DISLIKE
            },{
                where: {
                    like_id: like_id
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

    async like(like_id) {
        const t = await this.getTransaction();
        try{
            await this.model.XdXdLike.update({
                status: this.constant.LIKE_STATUS.LIKE
            },{
                where: {
                    like_id: like_id
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

    async incrementReplyLikeCount(reply_id, value){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdReply.update({
               like_count: this.model.literal(`like_count + ${value}`)
            },{
                where: {
                    reply_id: reply_id
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

module.exports = TopicReplyDao;
