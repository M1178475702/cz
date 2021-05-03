const Service = require('../../../core/service/ApiService');
const moment = require('moment');


class ArticleService extends Service {

    //创建文章编辑记录
    async createRecordEditArticle(articleInfo) {
        const t = await this.getTransaction();
        try {
            const editUpdateAttr = {
                article_id: articleInfo.article_id,
                author: articleInfo.author,
                title: articleInfo.title,
                content: articleInfo.content,
                article_section_id: articleInfo.article_section_id,
                cover_url: articleInfo.cover_url,
                summary: articleInfo.summary,
                tag_list: '',
                status: articleInfo.status,
                create_time: new Date(),
            };
            //该阶段的历史记录可能已经存在
            await this.model.XdXdRecordArticleEdit.create(editUpdateAttr, {transaction: t});
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

}

module.exports = ArticleService;

