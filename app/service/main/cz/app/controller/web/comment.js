const Controller = require('../../core/controller/ApiController');

class CommentController extends Controller {
    async addComment(){
        try{
            const rule = {
                articleId:'int', content:'string',
            };
            this.validate(rule,this.ctx.request.body);
            this.result.data = await this.service.comment.web.op.addComment(this.ctx.request.body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getCommentList(){
        try{
            const rule = {
                aid: 'int',
                offset: {type: 'int?', min: 0},
                page_size: {type: 'int?', min: 0}
            };
            const query = this.ctx.request.query;
            this.validate(rule,this.ctx.request.query);
            this.result.data = await this.service.comment.web.view.getClientCommentList(query.aid, query.offset, query.page_size);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }

    }

    async doLike(){
        const {ctx, service} = this;
        try {
            const params = ctx.params;
            this.validate({id: 'int'}, params);
            this.result.data.result = await service.comment.web.op.doLike(params.id);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }
}

module.exports = CommentController;
