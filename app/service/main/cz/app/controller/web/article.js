const Controller = require('../../core/controller/ApiController');

/**
 * @swagger
 * tags:
 *   - name: web-article-op
 *     description: web端文章操作
 */


class WebArticleController extends Controller {

    async getWebArticleList() {
        const {ctx, service} = this;
        try {
            const query = ctx.request.query;
            const rule = {
                order: {type: 'enum?', values: ['pub'], default: 'pub'},
                lm: {type:'anyDate?', default: new Date()},
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
                sec: 'int?',
                upDown: {type: 'enum?', values: ['up', 'down'], default: 'down'}
            };
            this.validate(rule, query);
            this.result.data = await service.article.web.view.getWedArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getWebArticleDetail() {
        const {ctx, service} = this;
        try {
            const params = ctx.params;
            const rule = {
                src: {type: 'enum?',values:Object.values(this.constant.SRC_TYPE),default: this.constant.SRC_TYPE.WEB_WX_XD,convertType:'int'}
            };
            this.validate({id: 'int',},params );
            this.validate(rule,ctx.request.query);
            this.result.data = await service.article.web.view.getClientArticleDetail(this.ctx.session.userId,params.id,ctx.request.query.src);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getNewestArticleId(){
        try{
            this.result.data = await this.service.article.web.view.getSpecialArticleId('new_publish');
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getWebHeatArticleList(){
        const {ctx, service} = this;
        try {
            const query = ctx.request.query;
            const rule = {
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
            };
            this.validate(rule, query);
            this.result.data = await service.article.web.view.getWebHeatArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getArticleListBySection(){
        try {
            const query = this.ctx.request.query;
            const rule = {
                section: 'int',
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
                lm: {type:'anyDate?',default: new Date()},
                upDown: {type: 'enum?', values: ['up', 'down'], default: 'down'}
            };
            this.validate(rule, query);
            this.result.data = await this.service.article.web.view.getArticleListBySection(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getUserInterestedArticleList(){
        try{
            const query = this.ctx.request.query;
            const rule = {
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
                lm: {type:'anyDate?',default: new Date()},
                section: 'int?'
            };
            this.validate(rule, query);
            this.result.data = await this.service.article.web.interested.getRandomArticleList(query.ps, query.section);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getUserUnreadArticleList(){
        try{
            const query = this.ctx.request.query;
            const rule = {
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
                lm: {type:'anyDate?',default: new Date()},
            };
            this.validate(rule, query);
            this.result.data = await this.service.article.web.unread.getUserUnreadArticleList(this.ctx.session.userId,query.lm,query.ps);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    /**
     * @swagger
     * /web/article/{id}/attitude:
     *   put:
     *     tags:
     *       - web-article-op
     *     summary: "提交用户对文章的态度"
     *     parameters:
     *     - name: id
     *       in: path
     *       type: integer
     *       description: 文章id
     *       required: true
     *       example: 10087
     *     - name: body
     *       in: body
     *       schema:
     *         type: object
     *         properties:
     *           attitude:
     *             type: integer
     *             required: true
     *             enum:
     *             - 1
     *             - 2
     *             - 3
     *             description: 1 喜欢 2一般 3不喜欢
     *     productions:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *         type: object
     *         schema:
     *           type: object
     *           properties:
     *             data:
     *               type: object
     *               properties:
     *                 isAddPoints:
     *                   type: integer
     *                   description: 是否添加了积分 1是 0否
     *                   example: 1
     *
     *
     *
     *
     */
    async doAttitude() {
        const {ctx, service} = this;
        try {
            const params = ctx.params;
            this.validate({id: 'int'}, params);
            this.validate({attitude: 'int'},ctx.request.body);   // TODO attitude => like_degree
            this.result.data = await service.article.web.op.doAttitude(this.ctx.session.userId,params.id,ctx.request.body.attitude);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }

    async doShare(){
        try {
            const params = this.ctx.params;
            this.validate({id: 'int'}, params);
            await this.service.article.web.view.doShare(this.ctx.session.userId,params.id);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }

    async updateViewDuration() {
        const {ctx, service} = this;
        try {
            const body = ctx.request.body;
            const params = ctx.params;
            params.dur = body.dur;
            this.validate({id:'int',dur:{type:'int',max:600}},params);
            this.result.data = await service.article.record.updateViewDuration(this.ctx.session.userId,params.id, params.dur);
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }

    async getNewestArticleList(){
        try{
            const rule = {
                lm: {type: 'anyDate?', default: new Date()},
                ps: 'int',
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.article.web.article.getNewestArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getHotArticleList(){
        try{
            const rule = {
                lm: {type: 'int?', default: Number.MAX_SAFE_INTEGER},
                ps: 'int',
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.article.web.article.getHotArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

}

module.exports = WebArticleController;
