const Controller = require('../../core/controller/ApiController');

class CollectionController extends Controller {

    async doCollect() {
        try {
            const rule = {
                item_id: 'int',
                type: 'int',
                coll_name: 'string?',
                folder: {type: 'int?', default: 0},
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            await this.service.collection.web.op.doCollect(this.ctx.session.userId, body.item_id, body.type, body.folder, body.coll_name);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }

    async undoCollect() {
        try {
            const rule = {
                // coll_id: 'int',
                item_id: 'int',
                type: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule, body);
            await this.service.collection.web.op.undoCollect(body.coll_id, this.ctx.session.userId, body.item_id, body.type);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getCollectionList() {
        try {
            const rule = {
                upDown: {type: 'enum?', values: ['up', 'down'], default: 'down'},
                lm: {type: 'anyDate?', default: new Date()},
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
                folder: {type: 'integer?', default: 0}
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.collection.web.view.getCollectionList(this.ctx.session.userId, query.folder, query.ps, query.lm, query.order);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

}

module.exports = CollectionController;
