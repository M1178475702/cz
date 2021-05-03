const Service = require('../../core/service/ApiService');

class ArticleService extends Service {
    async getArticleMetaById(article_id){
        const dao = this.service.article.dao;
        return dao.getArticleMetaById(article_id);
    }

}

module.exports = ArticleService;










