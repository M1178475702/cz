const Service = require('../../../core/service/ApiService');
const moment = require('moment');


class ArticleService extends Service {
    //编辑文章
    async editArticle(articleId, articleInfo) {
        const t = await this.getTransaction();
        try {
            if (this.ctx.helper.stringWidth(articleInfo.content) > 65500) {
                throw new this.error.InvalidError(`内容体积太大：${articleInfo.content.length}`);
            }
            const article = await this.model.XdXdArticle.findOne({where: {article_id: articleId}});
            if (!article) throw new this.error.InvalidError('无效id');

            //首先判断是否更改状态，若更改状态。则先更改状态，并将当前值保存历史记录
            if (articleInfo.status) {
                const status = this.constant.GET_CONSTANT_MAP(this.constant.ARTICLE_STATUS_CLIENT, this.constant.ARTICLE_STATUS, articleInfo.status);
                //修改了状态
                if (status) {
                    switch (status) {
                        case this.constant.ARTICLE_STATUS.APPROVE_PENDING:
                            break;
                        case this.constant.ARTICLE_STATUS.PUBLISH:
                            await this.publish(article, articleInfo);
                            break;
                        case this.constant.ARTICLE_STATUS.APPROVED_SECOND:
                            await this.approveSecond(article);
                            break;
                        case this.constant.ARTICLE_STATUS.DELETE:
                            await this.delete(article);
                            break;
                        case this.constant.ARTICLE_STATUS.DELAYED_PUBLISH:
                            await this.delayedPublish(article, articleInfo.delayedDate);
                            break;
                        default:
                            throw new this.error.InvalidError('该功能暂不能使用');
                    }
                }
            }

            //然后更新相关信息
            const updateAttr = {
                author: articleInfo.author,
                title: articleInfo.title,
                content: articleInfo.content,
                article_section_id: articleInfo.section,
                cover_url: articleInfo.cover,
                summary: articleInfo.summary,
            };
            //更新meta
            const promises = [];
            for (const tagId of articleInfo.newTagList) {
                promises.push(this.service.tag.back.articleRel.relateTagToArticle(article.article_id, tagId))
            }
            for (const tagId of articleInfo.deleteTagList) {
                promises.push(this.service.tag.back.articleRel.cancelRelateTagToArticle(article.article_id, tagId));
            }
            promises.push(article.update(updateAttr, {transaction: t}));
            await Promise.all(promises);
            //只有status存在，即提交版本时，才会创建记录
            //更新相关从表
            switch (articleInfo.srcType) {
                case this.constant.ARTICLE_TYPE.CRAWLER:
                    await this.model.XdXdArticleCrawler.update({
                        article_id: articleId,
                        src_site: articleInfo.site,
                        src_url: articleInfo.srcUrl,
                        src_views_count: articleInfo.srcViewsCount,
                        src_likes_count: articleInfo.srcLikesCount,
                        src_comments_count: articleInfo.srcCommentsCount,
                        src_tag_list: articleInfo.srcTagList || '',
                        src_publish_time: articleInfo.srcPublishTime
                    }, {where: {article_id: articleId}, raw: true, transaction: t});
                    break;
                case this.constant.ARTICLE_TYPE.REPRINT:
                    await this.model.XdXdArticleReprint.update({
                        article_id: articleId,
                        input_by: this.ctx.session.adminId,
                        src_site: articleInfo.site,
                        src_views_count: articleInfo.srcViewsCount,
                        src_likes_count: articleInfo.srcLikesCount,
                        src_comments_count: articleInfo.srcCommentsCount,
                        src_tag_list: articleInfo.srcTagList || '',
                        src_publish_time: articleInfo.srcPublishTime,
                        is_auth: parseInt(articleInfo.isAuth)
                    }, {where: {article_id: articleId}, raw: true, transaction: t});
                    break;
                case this.constant.ARTICLE_TYPE.ORIGINAL:
                    await this.model.XdXdArticleOriginal.create({
                        article_id: articleId,
                        authorization: articleInfo.authorization,
                    }, {raw: true, transaction: t});
                    break;
                default:
                    throw new this.error.InvalidError('无效源类型');
            }

            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //发布文章
    async publish(article) {
        const t = await this.getTransaction();
        try {
            if (!this.ctx.helper.isObject(article))
                article = await this.model.XdXdArticle.findOne({where: {article_id: article}});

            const now = new Date();
            const oldStatus = article.get('status');
            //添加文章动态属性

            const promises = [];
            promises.push(this.model.XdXdRecordArticleOp.create(
                {
                    article_id: article.get('article_id'),
                    op_by: this.ctx.session.adminId || 0,
                    op_type: this.constant.ARTICLE_OPERATE_CODE.PUBLISH,
                    create_time: now
                },
                {transaction: t}
            ));
            promises.push(this.service.article.back.record.createRecordEditArticle(article.get()));
            if (oldStatus !== this.constant.ARTICLE_STATUS.PUBLISH) {
                promises.push(
                    article.update(
                        {
                            publish_time: now,
                            status: this.constant.ARTICLE_STATUS.PUBLISH
                        },
                        {transaction: t}
                    )
                );
                promises.push(
                    this.model.XdXdArticleDynamicProp.upsert(
                        {article_id: article.get('article_id')},
                        {
                            where: {article_id: article.get('article_id')},
                            transaction: t
                        }
                    )
                )
            }
            await Promise.all(promises);
            if (oldStatus === this.constant.ARTICLE_STATUS.DELAYED_PUBLISH)
                await this.app.articlePublishClient.cancel(article.get('article_id'));
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //延时发布
    async delayedPublish(article, date) {
        const t = await this.getTransaction();
        try {
            if (!this.ctx.helper.isObject(article))
                article = await this.model.XdXdArticle.findOne({where: {article_id: article}});
            const updateAttr = {publish_time: date};
            const oldStatus = article.get('status');
            if (oldStatus !== this.constant.ARTICLE_STATUS.DELAYED_PUBLISH)
                updateAttr.status = this.constant.ARTICLE_STATUS.DELAYED_PUBLISH;
            await Promise.all([
                this.service.article.back.record.createRecordEditArticle(article.get()),
                article.update(
                    updateAttr,
                    {transaction: t}),
                this.model.XdXdRecordArticleOp.create(
                    {
                        article_id: article.get('article_id'),
                        op_by: this.ctx.session.adminId,
                        op_type: this.constant.ARTICLE_OPERATE_CODE.DELAYED_PUBLISH,
                        create_time: new Date()
                    },
                    {transaction: t}),
            ]);
            await this.app.articlePublishClient.setJob(article.get('article_id'), date);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //（伪）删除
    async delete(article) {
        const t = await this.getTransaction();
        try {
            if (!this.ctx.helper.isObject(article))
                article = await this.model.XdXdArticle.findOne({where: {article_id: article}});
            const now = new Date();
            //更新文章状态为 发布
            const oldStatus = article.get('status');
            await Promise.all([
                this.service.article.back.record.createRecordEditArticle(article.get()),
                article.update(
                    {status: this.constant.ARTICLE_STATUS.DELETE,},
                    {transaction: t}
                ),
                //添加审核记录
                this.model.XdXdRecordArticleOp.create(
                    {
                        article_id: article.get('article_id'),
                        op_by: this.ctx.session.adminId,
                        op_type: this.constant.ARTICLE_OPERATE_CODE.DELETE,
                        create_time: now
                    },
                    {transaction: t})
            ]);
            if (oldStatus === this.constant.ARTICLE_STATUS.DELAYED_PUBLISH)
                await this.app.articlePublishClient.cancel(article.get('article_id'));
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //二审通过
    async approveSecond(article) {
        const t = await this.getTransaction();
        try {
            if (!this.ctx.helper.isObject(article))
                article = await this.model.XdXdArticle.findOne({where: {article_id: article}});
            const now = new Date();
            const oldStatus = article.get('status');
            //更新文章状态为 发布
            await Promise.all([
                this.service.article.back.record.createRecordEditArticle(article.get()),
                //添加审核记录
                this.model.XdXdRecordArticleOp.create(
                    {
                        article_id: article.get('article_id'),
                        op_by: this.ctx.session.adminId,
                        op_type: this.constant.ARTICLE_OPERATE_CODE.APPROVED_SECOND,
                        create_time: now
                    },
                    {transaction: t}
                )
            ]);
            if (oldStatus === this.constant.ARTICLE_STATUS.DELAYED_PUBLISH)
                await this.app.articlePublishClient.cancel(article.get('article_id'));
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //文章查重
    async articleDuplicateChecking(articleInfo) {
        const dateRange = 7;
        const begin = this.ctx.helper.farawayDays(-dateRange);
        const list = await this.model.XdXdArticle.findAll({
            where: {create_time: {$gte: begin},},
            order: [['create_time', 'DESC']],
            raw: true
        });
        let result = {
            isDup: false,
            reason: [],
        };
        for (let article of list) {
            result = await this._articleDuplicateChecking(articleInfo, article);
            if (result.isDup)
                break;
        }
        return result;
    }

    //内部方法：查重
    async _articleDuplicateChecking(l_article, r_article) {
        const tagRegexp = /<[^>]*>/g;
        const result = {
            isDup: false,
            reason: [],
        };
        //title的重复比较
        const title_threshold = 95 / 100;           //标题重复阙值
        //TODO  title直接在本进程做
        const title_lcs = this.ctx.helper.LCS(l_article.title, r_article.title);
        const title_dup_rate = title_lcs / l_article.title.length;
        if (title_dup_rate > title_threshold) {
            result.isDup = true;
            result.reason.push({
                desc: `标题重复度超过：${title_threshold * 100}%`,
                dup_rate: Math.floor(title_dup_rate * 100)
            })
        }
        const content_threshold = 80 / 100;           //内容重复度阙值
        const content_length_diff_threshold = 50 / 100;       //内容长度相差阙值
        const leftClearContent = l_article.content.replace(tagRegexp, '');      //左边文章,去除标签后
        const rightClearContent = r_article.content.replace(tagRegexp, '');
        const content_length_diff = Math.abs(leftClearContent.length - rightClearContent.length) / leftClearContent.length;
        if (content_length_diff <= content_length_diff_threshold) {
            let content_lcs;
            const wingmanResult = await this.app.wingmanClient.doTask('LCS', [leftClearContent, rightClearContent]);
            //TODO 倘若失败，则在本进程查重
            if (wingmanResult.error) {
                content_lcs = this.ctx.helper.LCS(leftClearContent, rightClearContent);
            } else {
                content_lcs = wingmanResult.result;
            }

            const content_dup_rate = content_lcs / leftClearContent.length;
            if (content_dup_rate >= content_threshold) {
                result.isDup = true;
                result.reason.push({
                    desc: `内容重复度超过：${content_threshold * 100}%`,
                    dup_rate: Math.floor(content_dup_rate * 100)
                })
            }
        }
        if (result.isDup)
            result.dupArticle = {
                id: r_article.article_id,
                title: r_article.title
            };
        return result;
    }

}

module.exports = ArticleService;

