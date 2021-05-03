const Controller = require('../../core/controller/ApiController');

/**
 * @swagger
 * tags:
 *   - name: web-article-op
 *     description: web端文章操作
 */


class WebReplyController extends Controller {

    async getRootReplyWithSubReplyList() {
        try {
            const rule = {
                pn: 'int',
                ps: 'int',
                origin_id: 'int',
                type: {type: 'enum', values: Object.values(this.constant.REPLY_ORIGIN_TYPE), convertType: 'int'}
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.reply.web.reply.getRootReplyWithSubReplyList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getSubReplyList() {
        try {
            const rule = {
                pn: 'int',
                ps: 'int',
                reply_id: 'int',
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.reply.web.reply.getSubReplyList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async addReply() {
        try {
            const rule = {
                origin_id: 'int',
                type: {type: 'enum', values: Object.values(this.constant.REPLY_ORIGIN_TYPE), convertType: 'int'},
                content: {type: 'string', max: 10000},
                root_id: 'int',
                parent_id: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            body.user_id = this.ctx.session.userId;
            await this.service.reply.web.reply.addReply(body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async doLike(){
        try{
            const rule = {
              reply_id: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            this.result.data = await this.service.reply.web.like.doLike(this.ctx.session.userId, body.reply_id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }


}

module.exports = WebReplyController;
