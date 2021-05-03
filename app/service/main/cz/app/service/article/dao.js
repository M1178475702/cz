const Service = require('../../core/service/ApiService');

class ArticleDao extends Service {

    async getArticleMetaById(article_id){
        return this.model.XdXdArticle.findOne({
            where: {
                article_id: article_id
            }
        })
    }
}

module.exports = ArticleDao;
