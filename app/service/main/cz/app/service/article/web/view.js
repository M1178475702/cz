const Service = require('../../../core/service/ApiService');
const moment = require('moment');


class ArticleService extends Service {
    //获取web端文章列表
    async getWedArticleList(options) {
        const searchOpt = {
            orderBy: options.order,
            lastMark: options.lm,
            pageSize: options.ps,
            section: options.sec,
            upDown: options.upDown
        };

        const where = {};
        searchOpt.orderBy = 'publishTime';
        if (searchOpt.sec) where.sectionId = parseInt(searchOpt.section);

        let begin, end;
        switch (searchOpt.upDown) {
            case 'up':
                searchOpt.upDown = 'ASC';
                begin = this.ctx.helper.farawayDays(0, 23, 59, 59, searchOpt.lastMark);
                end = this.ctx.helper.farawayDays(searchOpt.pageSize, 23, 59, 59, searchOpt.lastMark);
                where[searchOpt.orderBy] = {$between: [begin, end]};
                break;
            case 'down':
                searchOpt.upDown = 'DESC';
                begin = this.ctx.helper.farawayDays(0, 23, 59, 59, searchOpt.lastMark);
                where[searchOpt.orderBy] = {$lt:begin};
                break;
        }

        const articleList = await this.model.XdXdViClientArticleList.findAll({
            where: where,
            limit: searchOpt.pageSize,
            order: [[searchOpt.orderBy, searchOpt.upDown], ['id', 'DESC']],
            raw: true
        });
        const resultList = {};
        let curDate;
        for (const article of articleList) {
            let time = moment(article.publishTime);
            article.publishTime = time.format('YYYY/MM/DD HH:mm');
            article.isRead = await this.service.article.record.isRead(this.ctx.session.userId,article.id);
            if (time.format('YYYY/MM/DD') === curDate) {
                resultList[curDate].push(article);
            } else {
                curDate = time.format('YYYY/MM/DD');
                resultList[curDate] = [];
                resultList[curDate].push(article);
            }
        }

        return {
            articleList: resultList,
            lm: articleList.length ? end : null,
            ps: options.ps
        };
    }

    //热度（浏览量）
    async getWebHeatArticleList(options) {
        const searchOpt = {
            pageSize: options.ps
        };
        const articleList = await this.model.XdXdViClientArticleList.findAll({
            attributes: ['id', 'title', 'summary', 'viewsCount','cover'],
            order: [['viewsCount', 'DESC']],
            limit: searchOpt.pageSize,
            raw: true
        });
        const promises = articleList.map(async (article)=>{
            article.isRead = await this.service.article.record.isRead(this.ctx.session.userId,article.id);
            article.tagList = await this.service.tag.web.view.getArticleRelateTagList(article.id);
        });
        await Promise.all(promises); 
        return {
            articleList: articleList
        }
    }

    //根据板块分类
    async getArticleListBySection(options) {
        const findOpt = {
            where: {
                sectionId: options.section
            },
            attributes: ['id', 'title', 'summary', 'viewsCount','publishTime','cover'],

            limit: options.ps,
            raw: true
        };
        if(options.upDown === 'up'){
            findOpt.order= [['publishTime', 'ASC']];
            if(options.lm)
                findOpt.where.publishTime = {$gt: options.lm};
        } else {
            findOpt.order= [['publishTime', 'DESC']];
            if(options.lm)
                findOpt.where.publishTime = {$lt: options.lm};
        }

        const articleList = await this.model.XdXdViClientArticleList.findAll(findOpt);
        const user_id = this.ctx.session.userId;
        const promises = articleList.map(async (article)=>{
            article.tagList = await this.service.tag.web.view.getArticleRelateTagList(article.id);
            if(user_id)
                article.isRead = await this.service.article.record.isRead(user_id,article.id)
        });
        await Promise.all(promises);
        return {
            articleList: articleList,
            lm: articleList.length ? articleList[articleList.length - 1].publishTime : null,
            ps: options.ps,
            section: options.section
        }
    }

    //获取文章详情
    async getClientArticleDetail(user_id, article_id, src) {
        const t = await this.getTransaction();
        try {
            const findOpt = {
                where: {id: article_id},
                raw: true
            };
            const article = await this.model.XdXdViClientArticleDetail.findOne(findOpt);
            if (!article)
                throw new this.error.InvalidError('无效文章');

            const [record_like, isCollected, record, isAppearRedPack] = await Promise.all([
                this.service.article.record.getRecordArticleAttitude(user_id, article_id),
                this.service.collection.rpc.isCollected(user_id, article_id, this.constant.COLLECTION_TYPE.ARTICLE),
                this.service.article.record.createRecordView(user_id, article_id, src),
                // this.service.redpack.articleInsideRedPack.isAppearRedPack(user_id)
            ]);
            article.attitude = record_like ? record_like.degree : 50;
            article.isCollected = isCollected ? 1 : 0;
            // article.isAppearRedPack = isAppearRedPack ? 1 : 0;
            ++article.viewsCount;
            await this.commit();
            return {
                article: article,
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //获取上一篇，下一篇
    async getLastAndNextArticle(articleId) {
        /*
        * 使用变量确定行数，然后用id确定行数，最后查出 +1行，-1行
        * */
        const result = await this.model.query(
            `SELECT d.RowNum,id,title,viewsCount
             FROM
            	(
	            SELECT ( @i := @i + 1 ) AS RowNum,A.id ,A.title,	A.viewsCount
	            FROM xd_xd_vi_client_article_list A,( SELECT @i := 0 ) B 
	            ORDER BY A.\`publishTime\` DESC,A.\`id\` desc
	            ) d,
	            (
	            SELECT RowNum 
	            FROM (SELECT ( @j := @j + 1 ) AS RowNum,A.id ,A.title,A.viewsCount 
	            FROM xd_xd_vi_client_article_list A,( SELECT @j := 0 ) B 
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
                        viewsCount: result[0][0].viewsCount,
                    }
                };
            else {
                return {

                    next: {
                        id: result[0][0].id,
                        title: result[0][0].title,
                        viewsCount: result[0][0].viewsCount,
                    },
                    last: null
                }
            }
        } else {
            return {
                next: {
                    id: result[0][0].id,
                    title: result[0][0].title,
                    viewsCount: result[0][0].viewsCount,
                },
                last: {
                    id: result[0][1].id,
                    title: result[0][1].title,
                    viewsCount: result[0][1].viewsCount,
                }
            }
        }
    }

    //获取指定类型文章id
    async getSpecialArticleId(type) {
        try {
            switch (type) {
                case 'new_publish':
                    return await this.model.XdXdArticle.findOne({
                        where: {status: this.constant.ARTICLE_STATUS.PUBLISH},
                        order: [['publish_time', 'DESC'], ['article_id', 'DESC']],
                        attributes: [['article_id', 'id']]
                    });

                default:
                    throw new this.error.InvalidError('无效类型');
            }
        }
        catch (error) {
            throw error;
        }

    }

}

module.exports = ArticleService;
