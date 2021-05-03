const Controller = require('../../core/controller/ApiController');

class TopicController extends Controller {

    async createTopic(){
        try{
            const rule = {
                title: 'string',
                content: 'string',
                cover: 'string',
                status: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            body.created_by = this.ctx.session.adminId;
            await this.service.topic.back.topic.createTopic(body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getTopicList(){
        try{
            const rule = {
                pn: 'int',
                ps: 'int',
                status: 'int?',
                topic_id: 'int?',
                title: 'string?',
                order: {type: 'enum?', values: ['new'], default: 'new'}
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.topic.back.topic.getTopicList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async updateTopicInfo(){
        try{
            const rule = {
                topic_id: 'int',
                title: 'string',
                content: 'string',
                cover: 'string',
                status: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            body.created_by = this.ctx.session.adminId;
            await this.service.topic.back.topic.updateTopicInfo(body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async updateTopicStatus(){
        try{
            const rule = {
                topic_id: 'int',
                status: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            body.created_by = this.ctx.session.adminId;
            await this.service.topic.back.topic.updateTopicStatus(body.topic_id, body.status);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = TopicController;
