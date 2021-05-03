const Controller = require('../../core/controller/ApiController');

class UserRankController extends Controller{

    async getIndexContent(){
        try{
            this.result.data = await this.service.article.web.index.getIndexContent();
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async getIndexSectionContent(){
        try{
            this.result.data.section_list = await this.service.article.web.index.getSectionArticle();
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getIndexNewestArticleList() {
        try{
            const rule = {
                ps: 'int'
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.article.web.index.getNewestArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async getIndexHotArticleList(){
        try{
            const rule = {
                ps: 'int'
            };
            const query = this.ctx.request.query;
            this.validate(rule, query);
            this.result.data = await this.service.article.web.index.getHotArticleList(query);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }


}

module.exports = UserRankController;
