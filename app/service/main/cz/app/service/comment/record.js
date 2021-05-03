const Service = require('../../core/service/ApiService');

class CommentService extends Service {

    //获取评论喜欢记录
    async getRecordCommentLiked(userId, commentId) {
        return await this.model.XdXdRecordCommentLike.findOne({
            where: {user_id: userId, comment_id: commentId},
            raw: true,
        });
    }

}

module.exports = CommentService;
