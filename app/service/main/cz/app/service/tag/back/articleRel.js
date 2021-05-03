const Service = require('../../../core/service/ApiService');

class ArticleTagRelService extends Service {

    async relateTagToArticle(articleId, tagId) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdArticleTagRel.create(
                {
                    article_id: articleId,
                    tag_id: tagId
                }, {
                    transaction: t,
                    raw: true
                }
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async cancelRelateTagToArticle(articleId, tagId) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdArticleTagRel.destroy({
                    where: {
                        article_id: articleId,
                        tag_id: tagId
                    },
                    transaction: t,
                    raw: true
                }
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async getArticleRelateTagList(articleId) {
        try {
            return await this.model.XdXdViArticleTagList.findAll({
                where: {
                    articleId: articleId,
                    tagStatus: 11
                },
                attributes: [['tagId', 'id'], ['tagName', 'name'], ['tagStatus','status']],
                order: [['ctime', 'ASC']],
                raw: true
            });
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = ArticleTagRelService;
