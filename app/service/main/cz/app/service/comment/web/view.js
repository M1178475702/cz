const Service = require('../../../core/service/ApiService');
const moment = require('moment');

class CommentService extends Service {

    async getClientCommentList(article_id, offset, page_size) {
        const promises = this.ctx.helper.getPromises();
        promises.push(this._getClientCommentList(article_id, offset, page_size));
        promises.push(this.getArticleCommentCount(article_id));
        const [comment_list, count] = await promises.execute();
        return {
            comment_list: comment_list,
            count: count
        };
    }

    async getArticleCommentCount(article_id){
        const prop = await this.model.XdXdArticleDynamicProp.findOne({
            where: {
                article_id: article_id
            },
            attributes: ['coll_count'],
            raw: true
        });
        return prop.coll_count;
    }

    async _getClientCommentList(article_id, offset, page_size) {
        const findOpt = {
            where: {articleId: article_id},
            order: [['ctime','DESC']],
            raw: true
        };
        if(offset)
            findOpt.offset = offset;
        if(page_size)
            findOpt.limit = page_size;
        const comment_list = await this.model.XdXdViClientComment.findAll(findOpt);
        const promises = comment_list.map(async (comment)=>{
            const record_like = await this.service.comment.record.getRecordCommentLiked(this.ctx.session.userId, comment.commentId);
            comment.liked = record_like ? record_like.status === 1 ? 'true' : 'false' : 'false';
            comment.ctime = moment(comment.ctime).format('YYYY-MM-DD HH:mm');
        });
        await Promise.all(promises);
        return comment_list;
    }

}

module.exports = CommentService;
