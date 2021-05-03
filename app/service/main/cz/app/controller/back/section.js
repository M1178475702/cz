const Controller = require('../../core/controller/ApiController');
class BackSectionController extends Controller {

    /**
     * @swagger
     * tags:
     * - name: "back-section"
     *   description: "后台文章版块"
     */

    /**
     * @description: "版块模型"
     * @swagger
     * definitions:
     *   ApiResult-sectionList:
     *     type: object
     *     properties:
     *       data:
     *         type: object
     *         properties:
     *           sectionList:
     *             type: array
     *             items:
     *               $ref: "#/definitions/版块Model"
     *             description: 版块列表
     *       prompt:
     *         type: string
     *         example: '操作成功'
     *         description: 返回信息
     *       error:
     *         type: string
     *         example: ""
     *         description: 错误信息
     *       retCode:
     *         type: integer
     *         example: 1
     *         description: 1操作成功  -500服务器错误 -1参数错误 -401未登录  -403没有权限
     *   版块Model:
     *     type: object
     *     description: 积分记录模型
     *     properties:
     *       id:
     *         type: integer
     *         description: 版块id
     *       name:
     *         type: string
     *         example: "教育资讯"
     *         description: 版块名称
     *       status:
     *         type: integer
     *         description: 版块状态 1启用 0不启用
     */
    /**
     * @swagger
     * /back/section/list:
     *   get:
     *     tags:
     *       - section
     *     summary: "获取版块列表"
     *     description: 获取版块列表
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: OK
     *         schema:
     *           $ref: '#/definitions/ApiResult-sectionList'
     */
    async getSectionList(){
        const {ctx,service} = this;
        try{
            this.result.data.sectionList = await service.section.back.view.getSectionList();
            this.success();
        }
        catch (error) {
            this.handleError(error)
        }
    }
}

module.exports = BackSectionController;
