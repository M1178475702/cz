const Controller = require('../../core/controller/ApiController');

/**
 * @swagger
 * tags:
 *   - name: web-article-op
 *     description: web端文章操作
 */


class WebTopicController extends Controller {

    async getTopicList(){
        try {
            const rule = {
                pn: 'int',
                ps: 'int',
                order: ['new', 'hot']
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.topic.web.topic.getTopicList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getTopicByTopicId(){
        try {
            const rule = {
                topic_id: 'int'
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.topic.web.topic.getTopicByTopicId(query.topic_id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = WebTopicController;
