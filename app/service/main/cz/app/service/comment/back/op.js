const Service = require('../../../core/service/ApiService');

class CommentService extends Service {


    async auditComment(commentId, isPass) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdComment.update({
                    comment_id: commentId,
                    status: isPass === 'pass' ? 2 : -1,
                    audited_by: this.ctx.session.adminId
                }, {where: {comment_id: commentId}, transaction: t}
            );
            await this.model.XdXdRecordCommentAudit.upsert({
                comment_id: commentId,
                audited_by: this.ctx.session.adminId,
                op_type: isPass === 'pass' ? 1 : -1
            }, {where: {comment_id: commentId}, transaction: t});
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}

module.exports = CommentService;
