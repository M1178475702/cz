const Service = require('../../../core/service/ApiService');

class ArticleService extends Service {

    async getNewestArticleList(options){
        const dao = this.service.article.web.dao;
        const article_list = await dao.article.getNewestArticleList(options.lm, options.ps);
        return {
            article_list: article_list,
            lm: article_list.length ? article_list[article_list.length - 1].publishTime : null,
            ps: options.ps
        }
    }

    async getHotArticleList(options){
        const dao = this.service.article.web.dao;
        const article_list = await dao.article.getHotArticleList(options.lm, options.ps);
        return {
            article_list: article_list,
            lm: article_list.length ? article_list[article_list.length - 1].viewsCount : null,
            ps: options.ps
        }
    }

}

module.exports = ArticleService;
