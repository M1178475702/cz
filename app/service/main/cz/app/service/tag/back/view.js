const Service = require('../../../core/service/ApiService');

class ArticleTagRelService extends Service {



    async getTagList(status) {
        try {
            const where = {
                status: 11
            };
            return await this.model.XdXdTag.findAll({
                where: where,
                attributes: [['tag_id', 'id'], 'name', 'status'],
                raw: true
            })
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = ArticleTagRelService;
