const Controller = require('../../core/controller/ApiController');

class TagController extends Controller {
    async createTag() {
        try {
            const rule = {
                name: 'string'
            };
            this.validate(rule, this.ctx.request.body);
            this.result.data = await this.service.tag.back.op.createTag(this.ctx.request.body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async deleteTag() {
        try {
            const rule = {
                id: 'int'
            };
            this.validate(rule, this.ctx.request.body);
            await this.service.tag.back.op.deleteTag(this.ctx.request.body.id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async editTag() {
        try {
            const rule = {
                id: 'int',
                name: 'string',
                status: {type: 'enum', values: [10, 11], convertType: 'int'}
            };
            this.validate(rule, this.ctx.request.body);
            this.result.data = await this.service.tag.back.op.editTag(this.ctx.request.body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getTagInfo() {
        try {
            const rule = {
                id: 'int',
            };
            this.validate(rule, this.ctx.params);
            this.result.data = await this.service.tag.common.getTagById(this.ctx.params.id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getTagList() {
        try {
            const rule = {
                status: {type: 'enum?', values: [0, 10, 11], convertType: 'int', default: 11},
                ps: {type: 'int?', default: 0}
            };
            this.validate(rule, this.ctx.request.query);
            this.result.data.list = await this.service.tag.back.view.getTagList(this.ctx.request.query.status);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async createTagRel() {
        try {
            const rule = {
                tag_id: 'int',
                rel_tag_id: 'int',
                relevancy: [1, 2, 3]
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            this.result.data = await this.service.tag.back.tagRel.createTagRel(body.tag_id, body.rel_tag_id, body.relevancy);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async cancelRelTagToTag() {
        try {
            const rule = {
                rel_id: 'int',
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            await this.service.tag.back.tagRel.cancelRelTagToTag(body.rel_id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async editRelTag() {
        try {
            const rule = {
                rel_id: 'int',
                relevancy: [1, 2, 3]
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            await this.service.tag.back.tagRel.editRelTag(body.rel_id, body.relevancy);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getTagRelTagList() {
        try {
            const rule = {
                tag_id: 'int',
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data.rel_tag_list = await this.service.tag.back.tagRel.getTagRelTagList(query.tag_id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getTagClassAndTagList(){
        try{
            const tag_class_list = await this.service.tag.back.tagClass.getTagClassList();
            const promises = tag_class_list.map(async (tag_class) =>{
                tag_class.tag_list  = await this.service.tag.back.tagClass.getTagByTagClassId(tag_class.tag_class_id);
            });
            await Promise.all(promises);
            // this.result.data = await this.service.tag.back.tagClass.getTagClassAndTagList();
            this.result.data.tag_class_list = tag_class_list;
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async createTagClassRel(){
        try{
            const rule = {
                tag_class_id: 'int',
                tag_id: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            await this.service.tag.back.tagClass.createTagClassRel(body.tag_class_id, body.tag_id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }


}

module.exports = TagController;
