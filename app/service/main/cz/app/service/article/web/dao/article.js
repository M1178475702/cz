const Service = require('../../../../core/service/ApiService');

class ArticleDao extends Service {

    async getNewestArticleList(lm, ps){
        return this.model.XdXdViClientArticleList.findAll({
            where: {
                publishTime: {$lt: lm}
            },
            attributes: ['id', 'title', 'summary', 'viewsCount', 'cover', 'publishTime'],
            limit: ps,
            order: [['publishTime', 'DESC'], ['id', 'DESC']],
            raw: true
        });
    }

    //根据板块分类
    async getArticleListBySection(section_id, offset, ps) {
        return this.model.XdXdViClientArticleList.findAll({
            where: {
                sectionId: section_id
            },
            attributes: ['id', 'title', 'summary', 'viewsCount','publishTime','cover'],
            order: [['publishTime', 'DESC']],
            offset: offset,
            limit: ps,
            raw: true
        });
    }

    async get108QArticleListByPtime(lm, ps){
        const section_id = 10;
        const tag_id = 259;
        const sql = this.knex
            .select('article.id', 'article.title', 'article.summary', 'article.viewsCount', 'article.cover', 'article.publishTime')
            .from({article: 'xd_xd_vi_client_article_list'})
            .join({at: 'xd_xd_article_tag_rel'}, 'at.article_id', 'article.id')
            .where('at.tag_id', '=', tag_id)
            .where('article.sectionId', '=', section_id)
            .where('publishTime', '<', lm)
            .limit(ps)
            .orderBy('publishTime','DESC')
            .orderBy('article.id','DESC')
            .toString();
        return this.model.query(sql, {type: this.model.QueryTypes.SELECT});
    }

    async getHotArticleList(lm, page_size){
        return this.model.XdXdViClientArticleList.findAll({
            where: {
                viewsCount: {$lt: lm}
            },
            attributes: ['id', 'title', 'summary', 'viewsCount','cover', 'publishTime'],
            order: [['viewsCount', 'DESC'],['publishTime', 'DESC']],
            limit: page_size,
            raw: true
        });
    }
}

module.exports = ArticleDao;
