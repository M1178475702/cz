const Service = require('../../../core/service/ApiService');

class ArticleService extends Service {

    //获取首页内容
    async getIndexContent() {
        const promises = this.ctx.helper.getPromises();
        promises.push(this.service.article.web.interested._getRandomArticleList(5));
        promises.push(this.getChoicenessArticleList(0, 5));

        const [guess_list, choiseness_list] = await promises.execute();
        return {
            guess_list: guess_list,
            choiseness_list: choiseness_list,
        }
    }

    async getNewestArticleList(options) {
        // 一篇获取100问文章
        const dao = this.service.article.web.dao;
        const article_list = [];
        const Q100_len = 1;         //预期的数量
        const Q100_list = await dao.article.get108QArticleListByPtime(new Date(), Q100_len);
        const newest_article_list = await dao.article.getNewestArticleList(new Date(), options.ps);
        //去掉重复的
        for (let i = 0; i < Q100_list.length; ++i) {
            const index = this.helper.binary_search(
                newest_article_list, Q100_list[i],
                (left, right) => {
                    if (left.publishTime < right.publishTime)
                        return 1;
                    if (left.publishTime > right.publishTime)
                        return -1;
                    if (left.id < right.id)
                        return 1;
                    else
                        return -1;
                },
                (left, right) => {
                    return left.id === right.id;
                });
            if (index !== -1)
                newest_article_list.splice(index,1);
        }
        const over = newest_article_list.length - (options.ps - Q100_list.length);
        //去掉多余的
        if(over > 0){
            newest_article_list.splice(newest_article_list.length - 1, -over);
        }
        this.helper.concat(article_list, Q100_list);
        this.helper.concat(article_list, newest_article_list);
        return {
            article_list: article_list,
        }
    }

    async getHotArticleList(options) {
        const dao = this.service.article.web.dao;
        const article_list = await dao.article.getHotArticleList(Number.MAX_SAFE_INTEGER, options.ps);
        return {
            article_list: article_list,
        }
    }


    //精选文章
    async getChoicenessArticleList(offset, page_size) {
        const article_list = await this.model.XdXdViClientArticleList.findAll({
            attributes: ['id', 'title', 'summary', 'viewsCount', 'cover'],
            order: [['viewsCount', 'DESC']],
            limit: page_size,
            raw: true
        });
        const promises = article_list.map(async (article) => {
            article.tagList = await this.service.tag.web.view.getArticleRelateTagList(article.id);
        });
        await Promise.all(promises);
        return article_list
    }

    async getSectionArticle() {
        // const section_list = await this.service.section.web.view.getSectionList();
        const section_list = [{
            id: 11,
            name: 'FAQ',
            sort: 0
        },{
            id: 10,
            name: '书摘',
            sort: 1
        },{
            id: 1,
            name: '教育要闻',
            sort: 2
        },{
            id: 2,
            name: '学习干货',
            sort: 3
        },{
            id: 8,
            name: '心理健康',
            sort: 4
        },{
            id: 3,
            name: '社会热点',
            sort: 5
        },{
            id: 7,
            name: '生活目标',
            sort: 6
        },{
            id: 9,
            name: '职业规划',
            sort: 7
        }];
        const section_article_list = [];
        const promises = section_list.map(async (section) => {
            const article_list_obj = await this.service.article.web.view.getArticleListBySection({
                section: section.id,
                lm: new Date(),
                ps: 5
            });
            section_article_list.push({
                name: section.name,
                id: section.id,
                article_list: article_list_obj.articleList,
                sort: section.sort
            })
        });

        await Promise.all(promises);
        section_article_list.sort((a, b)=>{
            if(a.sort < b.sort)
                return 0;
            else
                return 1;
        });
        return section_article_list;
    }

}
module.exports = ArticleService;
