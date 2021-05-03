const constant = require('../../common/constant/xd-constant');
const Controller = require('../../core/controller/ApiController');

class AdminController extends Controller {

  /**
   * @swagger
   * tags:
   * - name: "back-admin"
   *   description: "后台管理员模块"
   */

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
   * @swagger
   * /back/admin/login:
   *   post:
   *     tags:
   *       - back-admin
   *     summary: "登录"
   *     description: "登录"
   *     parameters:
   *     - name: body
   *       in: body
   *       description: "账号&密码"
   *       schema:
   *         $ref: '#/definitions/ApiInput-Login'
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           $ref: '#/definitions/ApiResult-Login'
   */

  async login(){
    const { ctx, service} = this;
    try {
      const {account, pwd} = ctx.request.body;
      if (!account || !pwd)
        throw new this.error.PropertyRequiredError('account or pwd');

      this.result.data.info = await service.admin.admin.login(account, pwd);
      this.success();
    }
    catch (error) {
      this.handleError(error);
    }
  }

}

module.exports = AdminController;

/**
 * @swagger
 * definitions:
 *   ApiInput-Login:
 *     in: body
 *     type: object
 *     properties:
 *       account:
 *         type: string
 *         required: true
 *         example: "bakatora"
 *       pwd:
 *         type: string
 *         required: true
 *         example: "123456"
 *   ApiResult-Login:
 *     type: object
 *     schema:
 *       $ref: '#/definitions/ApiResult-Success'
 */
