/***
 * 用户未读的文章（猜你喜欢）
 * 2019/7/18
 */

const Service = require('../../../core/service/ApiService');

class ArticleService extends Service {

    async getUserUnreadArticleList(user_id, lm, page_size){
        const article_list = await this._getUserUnreadArticleList(user_id, lm, page_size);
        return {
            article_list: article_list,
            lm: article_list.length ? article_list[article_list.length - 1].publishTime : null,
            ps: page_size
        }
    }

    async _getUserUnreadArticleList(user_id, lm, page_size) {
        //查找用户有过历史记录的文章id
        // const promises = this.ctx.helper.getPromises();
        const read_article_list = await this.model.XdXdRecordArticleView.findAll({
            where: {
                user_id: user_id
            },
            attributes: [[this.model.literal(`DISTINCT article_id`), 'article_id']],
            raw: true
        });
        const read_article_id_list = this.ctx.helper._.pluck(read_article_list, 'article_id');
        const article_list = await this.model.XdXdViClientArticleList.findAll({
            where: {
                id: {$notIn: read_article_id_list},
                publishTime: {$lt: lm}
            },
            limit: page_size,
            order: [['publishTime','DESC']],
            raw: true
        });

        const promises = article_list.map(async (article) => {
            article.tagList = await this.service.tag.web.view.getArticleRelateTagList(article.id);
        });
        await Promise.all(promises);
        return article_list;
    }


}

module.exports = ArticleService;
