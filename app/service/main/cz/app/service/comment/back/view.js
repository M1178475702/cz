const Service = require('../../../core/service/ApiService');

class CommentService extends Service {

    async getBackCommentList(status, articleId) {
        const findOpt = {
            where: {},
            order: [['ctime', 'DESC']]
        };
        if (articleId) findOpt.where.articleId = articleId;
        if (status) findOpt.where.status = status;
        return this.model.XdXdViAuditorComment.findAll(findOpt);
    }

}

module.exports = CommentService;
