const Service = require('../../../core/service/ApiService');

class ArticleSectionService extends Service{
    async getSectionList(){
        try{
            const where = {
                status: 1
            };
            return this.model.XdXdArticleSection.findAll({
                where:where,
                attributes:[['article_section_id','id'],['name','name'],['icon_url','icon'],['status','status']],
                raw:true
            })
        }
        catch (error) {
            throw error;
        }
    }
}
module.exports = ArticleSectionService;
