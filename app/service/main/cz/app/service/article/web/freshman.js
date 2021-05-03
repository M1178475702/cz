const Service = require('../../../core/service/ApiService');

class ArticleService extends Service {

    //书摘
    async getExcerptArticleList(options){
        const section_id = 10;       //书摘板块id
        const dao = this.service.web.dao;
        return dao.article.getArticleListBySection(section_id, options.pn * options.ps, options.ps)
    }
}

module.exports = ArticleService;
