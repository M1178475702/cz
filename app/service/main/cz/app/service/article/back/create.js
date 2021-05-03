const Service = require('../../../core/service/ApiService');
const moment = require('moment');


class ArticleService extends Service {
    //添加文章(带发布）
    async addArticle(articleInfo, type) {
        const t = await this.getTransaction();
        try {
            if (this.ctx.helper.stringWidth(articleInfo.content) > 65500) {
                throw new this.error.InvalidError(`内容体积太大：${articleInfo.content.length}`);
            }
            const createTime = new Date();
            const article = await this.model.XdXdArticle.create(
                {
                    author: articleInfo.author,
                    src_type: type,
                    title: articleInfo.title,
                    content: articleInfo.content,
                    cover_url: articleInfo.cover,          //not required
                    article_section_id: parseInt(articleInfo.section),       //required
                    summary: articleInfo.summary || '',
                    is_choiceness: 0,
                    status: this.constant.ARTICLE_STATUS.APPROVE_PENDING,
                    create_time: createTime
                }, {
                    raw: true,
                    transaction: t
                }
            );
            const tagPromises = [];
            for (const tagId of articleInfo.newTagList) {
                tagPromises.push(this.service.tag.back.articleRel.relateTagToArticle(article.article_id, tagId))
            }
            await Promise.all(tagPromises);

            switch (type) {
                case 1:
                    await this.model.XdXdArticleCrawler.create({
                        article_id: article.article_id,
                        src_site: articleInfo.site,
                        src_url: articleInfo.srcUrl,
                        src_views_count: articleInfo.srcViewsCount,
                        src_likes_count: articleInfo.srcLikesCount,
                        src_comments_count: articleInfo.srcCommentsCount,
                        src_tag_list: articleInfo.srcTagList || '',
                        src_publish_time: articleInfo.srcPublishTime
                    }, {raw: true, transaction: t});
                    break;
                case 2:
                    await this.model.XdXdArticleReprint.create({
                        article_id: article.article_id,
                        input_by: this.ctx.session.adminId,
                        src_site: articleInfo.site,
                        src_views_count: articleInfo.srcViewsCount,
                        src_likes_count: articleInfo.srcLikesCount,
                        src_comments_count: articleInfo.srcCommentsCount,
                        src_tag_list: articleInfo.srcTagList || '',
                        src_publish_time: articleInfo.srcPublishTime,
                        is_auth: parseInt(articleInfo.isAuth)
                    }, {raw: true, transaction: t});
                    await this.model.XdXdRecordInput.create({
                        article_id: article.article_id,
                        input_by: this.ctx.session.adminId,
                        create_time: createTime
                    }, {raw: true, transaction: t});
                    break;
                case 3:
                    await this.model.XdXdArticleOriginal.create({
                        article_id: article.article_id,
                        authorization: articleInfo.authorization,
                    }, {raw: true, transaction: t});
                    break;
                default:
                    throw new this.error.InvalidError('无效源类型');
            }
            // await this.publish(article.article_id);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}

module.exports = ArticleService;

