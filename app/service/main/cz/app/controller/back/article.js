const Controller = require('../../core/controller/ApiController');


/**
 * @swagger
 * tags:
 *   - name: back-article-op
 *     description: 后台文章操作
 */


class BackArticleController extends Controller {
    //转载录入文章
    async inputArticleByReprint() {
        const {ctx, service} = this;
        try {
            const body = ctx.request.body;
            const rule = {
                title: 'string', author: 'string', section: 'int', content: 'string',site:'string',summary:'string?',
                cover:{type:'string?',default:''},
                newTagList:{type:'array',itemType:'int'},
                srcViewsCount: {type:'int?',default:0},
                srcCommentsCount: {type:'int?',default:0},
                srcLikesCount: {type:'int?',default:0},
                srcTagList: {type:'string?',allowEmpty:true,default:''},
                srcPublishTime: {type:'anyDate?',default:'0000-00-00 00:00:00'},
                isAuth: {type:'int?',default:0}
            };
            this.validate(rule, body);
            await service.article.back.create.addArticle(body, this.constant.ARTICLE_TYPE.REPRINT);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    //爬虫录入文章
    async inputArticleByCrawler() {
        const {ctx, service} = this;
        try {
            const body = ctx.request.body;
            const rule = {
                title: 'string', author: 'string', section: 'string', content: 'string',
                site:'string',srcViewsCount: {type:'int?',default:0},srcCommentsCount: {type:'int?',default:0},
                srcLikesCount: {type:'int?',default:0},srcTagList: {type:'string?',allowEmpty:true,default:''},
                srcUrl:'string',isAuth: {type:'int?',default:0},srcPublishTime: {type:'anyDate?',default:'0000-00-00 00:00:00'}
            };
            this.validate(rule, body);
            await service.article.back.edit.addArticle(body, this.constant.ARTICLE_TYPE.CRAWLER);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    //编辑文章
    /**
     *
     * @swagger
     * /back/article/{id}/edit:
     *   patch:
     *     tags:
     *       - back-article-op
     *     summary: 编辑文章
     *     parameters:
     *     - name: id
     *       in: path
     *       type: integer
     *       required: true
     *       description: 文章id
     *     - name: body
     *       in: body
     *       schema:
     *         $ref: '#/definitions/ApiInput-editArticle'
     *     productions:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/ApiResult-editArticle'
     *
     *
     */
    async editArticle() {
        const {ctx, service} = this;
        try {
            const body = ctx.request.body;
            const rule = {
                title: 'string', author: 'string', section: 'int', content: 'string',site:'string',summary:'string?',cover:{type:'string?',default:''},
                newTagList:{type:'array',itemType:'int'},
                deleteTagList:{type:'array',itemType:'int'},
                srcType: {type: 'int', values: [0,1, 2, 3]},                         //原类型
                srcViewsCount: {type:'int?',default:0},
                srcCommentsCount: {type:'int?',default:0},
                srcLikesCount: {type:'int?',default:0},
                srcTagList: {type:'string?',allowEmpty:true,default:''},
                srcPublishTime: {type:'anyDate?',default:'0000-00-00 00:00:00'},
                isAuth: {type:'int?',default:0},
                delayedDate: {type:'anyDate?',convertType:(val)=>{return new Date(val)}},
                status: {type: 'enum?',values:[10001,10002,10003,10004,10005,10006,10007,10008,'10001','10002','10003','10004','10005','10006','10007','10008'],convertType:'int'},
            };
            this.validate({id:'integer'},ctx.params);
            this.validate(rule, body);
            await service.article.back.edit.editArticle(ctx.params.id,body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    //发布or延时发布文章

    //审核文章列表，service里判断权限
    /**
     *
     * @swagger
     * /back/article/auditorList:
     *   get:
     *     tags:
     *     - back-article-op
     *     parameters:
     *     - name: offset
     *       in: query
     *       type: integer
     *       example: 0
     *       description: 偏移量
     *     - name: ps
     *       in: query
     *       type: integer
     *       example: 10
     *       description: 页大小
     *     - name: order
     *       in: query
     *       example: pub
     *       type: string
     *       enum:
     *       - pub
     *       - create
     *       description: 排序条件 pub按发布时间  create按创建时间 modify 最后修改时间（默认）一审只能按创建时间排序
     *     - name: upDown
     *       in: query
     *       type: string
     *       enum:
     *       - up
     *       - down
     *       - modify
     *       example: down
     *       description: 排序方式 升降序 up升序 down降序
     *     - name: status
     *       in: query
     *       type: integer
     *       description: 查询文章状态 0全部 10001伪删除 10002审核不通过 10003不可访问  10004待审核 10005一审通过 10006二审通过 10007延时发布 10008发布
     *       enum:
     *       - 0
     *       - 10001
     *       - 10002
     *       - 10003
     *       - 10004
     *       - 10005
     *       - 10006
     *       - 10007
     *       - 10008
     *     - name: srcType
     *       in: query
     *       type: integer
     *       description: 来源类型 0全部 1爬虫 2转载 3原创
     *       enum:
     *       - 0
     *       - 1
     *       - 2
     *       - 3
     *       example: 0
     *     - name: inputBy
     *       in: query
     *       type: string
     *       description: 录入人账号
     *     productions:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/ApiResult-AuditorArticleList'
     *
     *
     */
    async getAuditorArticleList() {
        const {ctx, service} = this;
        try {
            const query = ctx.request.query;
            const rule = {
                order: {type: 'enum?', values: ['pub', 'create','modify'], default: 'pub'}, //排序
                offset: {type: 'int?',default:0 },                                                     //你懂得
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},      //页大小
                section: 'int?',                                                       //板块id
                upDown: {type: 'enum?', values: ['up', 'down'], default: 'down'},  //升降序
                status: {type: 'enum?',values:[0,10000,10001,10002,10003,10004,10005,10006,10007,10008,'0','10000','10001','10002','10003','10004','10005','10006','10007','10008'],convertType:'int',default:0},                                       //文章状态
                srcType: {type: 'enum?', values: [0,1, 2, 3,'0','1', '2', '3'],convertType:'int',default:0},                         //原类型
                inputBy:{type:'string?'}
            };
            this.validate(rule, query);
            this.result.data = await service.article.back.view.getAuditorArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }


    //获取文章详情（分一审二审）
    //假定前端不清楚角色，则调用的接口为同一个，那么就在接口内判断权限
    //中间件只能通过URL来判断权限
    //如果使用完全使用中间件验证权限，则必须根据权限分清URL（路由）
    async getAuditorArticleDetail() {
        try {
            const params = this.ctx.params;
            this.validate({id:'int'},params);
            this.result.data = await this.service.article.back.view.getAuditorArticleDetail(params.id);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }


    async duplicateCheck(){
        try{
            const rule = {
                title: 'string', content: 'string'
            };
            this.validate(rule,this.ctx.request.body);
            this.result.data = await this.service.article.back.edit.articleDuplicateChecking(this.ctx.request.body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getArticleRelateTagList(){
        try{
            const rule = {
                id:'int'
            };
            this.validate(rule,this.ctx.params);
            this.result.data = await this.service.tag.back.articleRel.getArticleRelateTagList(this.ctx.params.id);
            this.success();
        }
        catch(error){
            this.handleError(error);
        }
    }


}
module.exports = BackArticleController;


/**
 * @swagger
 * definitions:
 *   ApiResult-Success:
 *     type: object
 *     properties:
 *       data:
 *         type: Object
 *         example: {}
 *         description: 空对象
 *       msg:
 *         type: object
 *         properties:
 *           prompt:
 *             type: string
 *             example: '操作成功'
 *             description: 返回信息
 *           error:
 *             type: string
 *             example: ""
 *             description: 错误信息
 *       retCode:
 *         type: integer
 *         example: 1
 *         description: 1操作成功  -500服务器错误 -1参数错误 -401未登录  -403没有权限
 */

/**
 *
 * @swagger
 * definitions:
 *   ApiInput-editArticle:
 *     in: body
 *     required: true
 *     description: 文章编辑入参
 *     schema:
 *       $ref: '#/definitions/ReprintArticleInfoModel'
 *
 */

/**
 * @swagger
 * definitions:
 *   ApiResult-AuditorArticleList:
 *     type: object
 *     properties:
 *       list:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 文章id
 *             title:
 *               type: string
 *               description: 文章标题
 *               example: title
 *             author:
 *               type: string
 *               description: 文章作者
 *               example: author
 *             sectionId:
 *               type: integer
 *               description: 版块id
 *               example: 1
 *             sectionName:
 *               type: string
 *               description: 版块名称
 *               example: 教育资讯
 *             status:
 *               type: integer
 *               description: 文章状态，范围同入参（没有0）
 *             srcType:
 *               type: integer
 *               description: 文章原类型，范围同入参（没有0）
 *             cover:
 *               type: string
 *               description: 封面url
 *             publishTime:
 *               type: string
 *               format: date
 *               description: 发布时间
 *             ctime:
 *               type: string
 *               format: date
 *               description: 发布时间
 *             mtime:
 *               type: string
 *               format: date
 *               description: 最后修改时间
 *             isChoiceness:
 *               type: integer
 *               description: 是否精选 1是 0否
 *       total:
 *         type: integer
 *         description: 总数
 *       ps:
 *         type: integer
 *         description: 本次查询使用的页大小
 *
 */



/**
 *
 * @swagger
 * definitions:
 *   ReprintArticleInfoModel:
 *     in: body
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: 文章标题
 *         required: true
 *         example: title
 *       author:
 *         type: string
 *         description: 文章作者
 *         required: true
 *         example: author
 *       section:
 *         type: integer
 *         description: 版块id
 *         required: true
 *         example: 1
 *       content:
 *         type: string
 *         description: 内容
 *         required: true
 *         example: content
 *       summary:
 *         type: string
 *         description: 摘要
 *         required: true
 *         example: ""
 *       cover:
 *         type: string
 *         description: 封面url
 *         required: true
 *         example: "https://api.hzxuedao.com/"
 *       status:
 *         type: integer
 *         description: 文章状态 10001伪删除 10002审核不通过 10003不可访问  10004待审核 10005一审通过 10006二审通过 10007延时发布 10008发布
 *         enum:
 *         - 10001
 *         - 10002
 *         - 10003
 *         - 10004
 *         - 10005
 *         - 10006
 *         - 10007
 *         - 10008
 *         required: true
 *         example: 10008
 *       site:
 *         type: string
 *         description: 来源站点
 *         required: true
 *         example: "知乎"
 *       srcType:
 *         type: integer
 *         description: 来源类型 1爬虫 2转载 3原创
 *         required: true
 *         enum:
 *         - 1
 *         - 2
 *         - 3
 *         example: 2
 *       srcViewsCount:
 *         type: integer
 *         description: 原浏览量
 *       srcCommentsCount:
 *         type: integer
 *         description: 原浏览量
 *       srcLikesCount:
 *         type: integer
 *         description: 原浏览量
 *       srcTagList:
 *         type: string
 *         description: 原浏览量
 *       srcPublishTime:
 *         type: string
 *         format: date
 *         description: 原浏览量
 *       isAuth:
 *         type: integer
 *         description: 是否授权文章
 *         example: 0
 *         enum:
 *         - 1
 *         - 0
 *         required: true
 *
 *
 *
 *
 *
 *
 */

/**
 * @swagger
 * definitions:
 *   ApiResult-editArticle:
 *     schema:
 *       $ref: '#/definitions/ApiResult-Success'
 *
 */

/**
 * @swagger
 * definitions:
 *   ArticleLikeModel:
 *     in: body
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: 文章标题
 *         required: true
 */




