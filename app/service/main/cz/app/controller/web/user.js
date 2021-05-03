const Controller = require('../../core/controller/ApiController');

class UserController extends Controller {

    /**
     * @swagger
     * tags:
     *   - name: web-user
     *     description: web登录
     */


    /**
     *
     * @swagger
     * /web/user/login:
     *   post:
     *     tags:
     *       - web-user
     *     summary: 登录，使用wxcode
     *     parameters:
     *     - name: body
     *       in: body
     *       required: true
     *       schema:
     *         $ref: '#/definitions/ApiInput-login'
     *     productions:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/ApiResult-login'
     *
     *
     */

    async login() {
        const {ctx, service} = this;
        try {
            //取wxcode
            const body = ctx.request.body;
            const rule = {wxcode: 'string'};
            this.validate(rule, body);
            this.result.data = await service.user.web.login.login(body.wxcode, 11); //11为服务号appid
            this.success('登录成功');
        }
        catch (error) {
            this.handleError(error);
        }

    }

    /**
     *
     * @swagger
     * /web/user/loginBySkey:
     *   post:
     *     tags:
     *       - web-user
     *     summary: "登录，使用skey"
     *     parameters:
     *     - name: body
     *       in: body
     *       required: true
     *       schema:
     *         $ref: '#/definitions/ApiInput-loginBySkey'
     *     productions:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/ApiResult-login'
     *
     *
     */
    async loginBySkey(){
        //存在skey，解密得出openid，重建session
        try{
            const rule = {seskey:'string'};
            this.validate(rule,this.ctx.request.body);
            this.result.data = await this.service.user.web.login.loginBySkey(this.ctx.request.body.seskey,11);
            this.success('登录成功');
        }
        catch (error) {
            this.handleError(error);
        }
    }

    /**
     *
     * @swagger
     * /web/user:
     *   get:
     *     tags:
     *       - web-user
     *     summary: 个人中心首页，获取用户信息
     *     productions:
     *     - application/json
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/ApiResult-userInfo'
     */
    async getUserInfo() {
        const {ctx, service} = this;
        try {
            this.result.data = await service.user.web.view.getSelfUserInfo(ctx.session.userId);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async updateUserInfo() {
        const {ctx, service} = this;
        try {
            const body = ctx.request.body;
            const rule = {
                username:'string',
                avatar:'string?',
                country:'string?',
                province:'string?',
                city:'string?',
            };
            this.validate(rule,body);
            await service.user.web.op.updateUserInfo(this.ctx.session.userId,body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async bindMobile(){
        try{
            const rule = {
                mobile: 'mobile'
            };
            this.validate(rule,this.ctx.request.body);
            await this.service.user.web.op.bindMobile(this.ctx.session.userId,this.ctx.request.body.mobile);
            this.success('绑定成功');
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getUserMobile(){
        try{
            this.result.data.mobile = await this.service.user.common.getUserMobile(this.ctx.session.userId);
            this.success('查询成功');
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async logout() {
        const {ctx, service} = this;
        try {
            await service.user.web.login.logout(ctx.session.userId);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async createRecordUserOp(){
        try{
            const rule = {
                // type: {type: 'enum',values:Object.values(this.constant.USER_OP_TYPE)}
                type: 'int'
            };
            const body = this.ctx.request.body;
            this.validate(rule,body);
            await this.service.user.record.createRecordUserOp(this.ctx.session.userId,body.type);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getUserCenterContent(){
        try{
            this.result.data = await this.service.user.web.center.getUserCenterContent(this.ctx.session.userId);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getViewHistoryRecord(){
        try{
            const rule = {
                ps: {type: 'int?', default: this.constant.DEFAULT_PAGE_SIZE},
                lm: {type:'anyDate?',default: new Date()}
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.user.web.history.getViewHistoryRecord(this.ctx.session.userId, query.lm, query.ps);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

}

module.exports = UserController;

/**
 *
 * @swagger
 * definitions:
 *   ApiInput-login:
 *     in: body
 *     type: object
 *     description: 网页端用户登录
 *     properties:
 *       wxcode:
 *         type: string
 *         required: true
 *   ApiResult-login:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         description: 用户信息
 *         properties:
 *           username:
 *             type: string
 *             description: 用户名
 *           skey:
 *             type: string
 *             description: 登录凭证，session到期时，以此证续期，需保存在本地
 *           isAuth:
 *             type: integer
 *             description: 是否授权用户 0 未授权 1授权
 *             example: 0
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
 *   ApiInput-loginBySkey:
 *     type: object
 *     properties:
 *       skey:
 *         type: string
 *         required: true
 *         example: ceshi
 *   ApiResult-userInfo:
 *     type: object
 *     description: 个人中心首页用户信息
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *             description: 用户名
 *           avatar:
 *             type: string
 *             description: 头像url
 *           level:
 *             type: integer
 *             description: 等级
 *             example: 1
 *           exp:
 *             type: float
 *             description: 经验值
 *             example: 5
 *           levelPercent:
 *             type: float
 *             description: 经验百分比（占该等级的），若定级则为1
 *             example: 0.5
 *           bonusPoints:
 *             type: integer
 *             description: 积分数
 *           levelName:
 *             type: string
 *             description: 等级名称（称号）
 *           collCount:
 *             type: integer
 *             description: 收藏数
 *           commentCount:
 *             type: integer
 *             description: 评论数
 *           viewCount:
 *             type: integer
 *             description: 历史数（浏览数）
 *
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
 *
 *
 */
