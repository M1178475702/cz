const Controller = require('../../core/controller/ApiController');

class BackCommentController extends Controller {
    async getCommentList() {
        try {
            const query = this.ctx.request.query;
            const rule = {
                aid: 'int?',
                status: {type: 'enum?', values: [-1, 1, 2, '-1', '1', '2'], convertType: (val) => parseInt(val)}
            };
            this.validate(rule, query);
            this.result.data.commentList = await this.service.comment.back.view.getBackCommentList(query.status, query.aid);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }

    }

    async auditComment() {
        const {ctx, service} = this;
        try {
            const rule = {
                id: 'int',
                isPass: {type: 'enum', values: ['pass', 'nopass']}
            };
            const params = ctx.params;
            params.isPass = ctx.request.body.isPass;
            this.validate(rule, params);
            this.result.data.result = await service.comment.back.op.auditComment(params.id, params.isPass);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }
}

module.exports = BackCommentController;
