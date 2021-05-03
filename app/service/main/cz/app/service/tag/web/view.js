const Service = require('../../../core/service/ApiService');

class TagService extends Service {

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

module.exports = TagService;
