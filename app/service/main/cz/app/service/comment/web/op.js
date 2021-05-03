const Service = require('../../../core/service/ApiService');

class CommentService extends Service {

    async addComment(commentInfo) {
        const t = await this.getTransaction();
        try {
            await Promise.all([
                this.model.XdXdComment.create(
                    {
                        article_id: commentInfo.articleId,
                        user_id: this.ctx.session.userId,
                        content: commentInfo.content,
                        //TODO  直接发布，不等待审核
                        status: this.constant.COMMENT_STATUS.APPROVED
                    },
                    {transaction: t}
                ),
                this.model.XdXdUser.update(
                    {comment_count: this.model.literal('comment_count + 1')},
                    {where:{user_id: this.ctx.session.userId},transaction: t}
                ),
                this.model.XdXdArticleDynamicProp.update(
                    {comments_count: this.model.literal('comments_count + 1')},
                    {where:{article_id: commentInfo.articleId},transaction: t}
                )
            ]);
            const begin = this.ctx.helper.farawayDays(0);
            //当篇文章阅读时长当天阅读记录大于20
            const reason = this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_SINGLE_READ_TIME_SPENT_20;
            const reasonCount = await this.service.bonusPoints.common.getReasonCount(this.ctx.session.userId,reason,begin);
            let addedPoints = 0;

            if(reasonCount < 1){
                if(commentInfo.content.length >= 20)
                    addedPoints = 10;
                else
                    addedPoints = 5;
                await this.service.bonusPoints.common.editBonusPoints(this.ctx.session.userId, reason,addedPoints);
            }
            await this.commit();
            return {
                addedPoints: addedPoints
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async doLike(commentId) {
        const t = await this.getTransaction();
        try {
            const recordLiked = await this.service.comment.record.getRecordCommentLiked(this.ctx.session.userId, commentId);
            let result;
            if (!recordLiked) {
                //如果没有点赞记录，则创建，点赞
                await Promise.all([
                    this.model.XdXdComment.update(
                        {likes_count: this.model.literal(`likes_count + 1`)},
                        {where: {comment_id: commentId}, transaction: t}
                    ),
                    this.model.XdXdRecordCommentLike.create({
                        comment_id: commentId,
                        user_id: this.ctx.session.userId,
                        status: 1,
                    }, {raw: true, transaction: t})
                ]);
                result = 'like';
            } else {
                //已经有点赞记录，且status为 like
                if (recordLiked.status === 1) {
                    await Promise.all([
                        this.model.XdXdComment.update(
                            {likes_count: this.model.literal(`likes_count - 1`)},
                            {where: {comment_id: commentId}, transaction: t}
                        ),
                        this.model.XdXdRecordCommentLike.update(
                            {status: 2},
                            {
                                where: {comment_id: commentId, user_id: this.ctx.session.userId},
                                transaction: t
                            }
                        )
                    ]);
                    result = 'unlike';
                } else if (recordLiked.status === 2) {
                    //已经有点赞记录，且status为 unlike
                    await Promise.all([
                        this.model.XdXdComment.update(
                            {likes_count: this.model.literal(`likes_count + 1`)},
                            {where: {comment_id: commentId}, transaction: t}
                        ),
                        this.model.XdXdRecordCommentLike.update(
                            {status: 1},
                            {
                                where: {comment_id: commentId, user_id: this.ctx.session.userId},
                                transaction: t
                            }
                        )
                    ]);
                    result = 'like';
                }
            }
            await this.commit();
            return result
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

}

module.exports = CommentService;
