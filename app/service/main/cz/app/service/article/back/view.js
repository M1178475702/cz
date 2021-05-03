const Service = require('../../../core/service/ApiService');
const moment = require('moment');


class ArticleService extends Service {

    //获取审核员文章列表(待增：按标题，作者，来源网站搜索
    async getAuditorArticleList(opt) {
        let list, total = 0;
        const findOpt = {
            where: {},
            offset: opt.offset,
            limit: opt.ps,
            raw: true
        };
        switch (opt.order) {
            case 'pub':
                findOpt.order = [['publishTime']];
                break;
            case 'create':
                findOpt.order = [['ctime']];
                break;
            case 'modify':
                findOpt.order = [['mtime']];
                break;
        }
        switch (opt.upDown) {
            case 'up':
                findOpt.order[0].push('ASC');
                break;
            case 'down':
                findOpt.order[0].push('DESC');
                break;
        }
        if (opt.section) findOpt.where.sectionId = opt.section;
        if (opt.srcType) findOpt.where.srcType = opt.srcType;
        if (opt.inputBy) {
            findOpt.where.srcType = this.constant.ARTICLE_TYPE.REPRINT;
            findOpt.where.inputBy = opt.inputBy;
        }

        switch (this.ctx.session.role) {
            case 1:   //超管
                if (opt.status) findOpt.where.status = this.constant.GET_CONSTANT_MAP(this.constant.ARTICLE_STATUS_CLIENT, this.constant.ARTICLE_STATUS, opt.status);
                [list, total] = await Promise.all([
                    this.model.XdXdViAuditorTwoArticleList.findAll(findOpt),
                    this.model.XdXdViAuditorTwoArticleList.count({where: findOpt.where})
                ]);
                break;
            default:
                throw new this.error.PermissionError('无效角色');
        }
        for (let article of list) {
            article.status = this.constant.GET_CONSTANT_MAP(this.constant.ARTICLE_STATUS, this.constant.ARTICLE_STATUS_CLIENT, article.status);
        }
        return {
            list: list,
            total: total,
            ps: opt.ps
        }

    }

    //获取审核员文章详情(总接口
    async getAuditorArticleDetail(articleId) {
        let article = await this.model.XdXdArticle.findOne({
            where: {article_id: articleId},
            attributes: ['src_type'],
            raw: true
        });
        if (!article)
            throw new this.error.InvalidError('无效id');
        switch (article.src_type) {
            case this.constant.ARTICLE_TYPE.CRAWLER:
                return await this.getCrawlerArticleDetail(articleId);
            case this.constant.ARTICLE_TYPE.REPRINT:
                return await this.getReprintArticleDetail(articleId);
            default:
                throw new this.error.InvalidError('暂不支持的类型');
        }
    }

    //获取爬虫文章详情
    async getCrawlerArticleDetail(articleId) {
        const findOpt = {
            where: {article_id: articleId},
            raw: true
        };
        const article = await this.model.XdXdViArticleCrawler.findOne(findOpt);
        if (!article)
            throw new this.error.InvalidError('无效id');
        article.publishTime = moment(article.publishTime).format('YYYY/MM/DD hh:mm');
        return article;
    }

    //获取转载文章详情
    async getReprintArticleDetail(articleId) {
        const article = await this.model.XdXdViArticleReprint.findOne({
            where: {id: articleId},
            raw: true
        });
        if (!article)
            throw new this.error.InvalidError('无效id');
        article.viewsCount = article.viewsCount || 0;
        article.status = this.constant.GET_CONSTANT_MAP(this.constant.ARTICLE_STATUS, this.constant.ARTICLE_STATUS_CLIENT, article.status);
        article.tagList = await this.service.tag.back.articleRel.getArticleRelateTagList(articleId);
        const {last, next} = await this.getLastAndNextArticle(articleId);
        article.last = last;
        article.next = next;
        return article;
    }

    //获取延时发布文章的id
    async getDelayedPublishArticleIds() {
        return this.model.XdXdArticle.findAll({
            where: {
                status: this.constant.ARTICLE_STATUS.DELAYED_PUBLISH
            },
            attributes: ['article_id', 'publish_time'],
            raw: true
        })
    }

    //获取上一篇，下一篇
    async getLastAndNextArticle(articleId) {
        /*
        * 使用变量确定行数，然后用id确定行数，最后查出 +1行，-1行
        * */
        const result = await this.model.query(
            `SELECT d.RowNum,id,title,views_count
             FROM
            	(
	            SELECT ( @i := @i + 1 ) AS RowNum,A.id ,A.title, A.views_count
	            FROM xd_xd_vi_auditor_two_article_list A,( SELECT @i := 0 ) B 
	            ORDER BY A.\`publishTime\` DESC,A.\`id\` desc
	            ) d,
	            (
	            SELECT RowNum 
	            FROM (SELECT ( @j := @j + 1 ) AS RowNum,A.id ,A.title,A.views_count 
	            FROM xd_xd_vi_auditor_two_article_list A,( SELECT @j := 0 ) B 
	            ORDER BY A.\`publishTime\` DESC,A.\`id\` desc ) q  
	            WHERE id = ${articleId}
	            ) cur  
	         WHERE d.RowNum = cur.RowNum - 1   OR d.RowNum = cur.RowNum + 1; ;`
        );

        if (result[0].length === 1) {
            if (result[0][0].RowNum === 2)
                return {
                    next: null,
                    last: {
                        id: result[0][0].id,
                        title: result[0][0].title,
                        viewsCount: result[0][0].views_count,
                    }
                };
            else {
                return {

                    next: {
                        id: result[0][0].id,
                        title: result[0][0].title,
                        viewsCount: result[0][0].views_count,
                    },
                    last: null
                }
            }
        } else {
            return {
                next: {
                    id: result[0][0].id,
                    title: result[0][0].title,
                    viewsCount: result[0][0].views_count,
                },
                last: {
                    id: result[0][1].id,
                    title: result[0][1].title,
                    viewsCount: result[0][1].views_count,
                }
            }
        }
    }

}

module.exports = ArticleService;

