/***
 * 用户感兴趣的文章（猜你喜欢）
 * 2019/7/18
 */

const Service = require('../../../core/service/ApiService');

class ArticleService extends Service {

    async getRandomArticleList(page_size, section){
        const article_list = await this._getRandomArticleList(page_size, section);
        return {
            article_list: article_list,
            ps: page_size
        }
    }

    async _getRandomArticleList(page_size, section){
        const findOpt = {
            where: {},
            attributes: ['id','title','cover','viewsCount','publishTime','summary'],
            order: this.model.random(),
            limit: page_size,
            raw: true
        };
        if(section){
            findOpt.where.sectionId = section
        }
        const article_list =  await this.model.XdXdViClientArticleList.findAll(findOpt);
        const promises = article_list.map(async (article)=>{
            article.tagList = await this.service.tag.web.view.getArticleRelateTagList(article.id);
        });
        await Promise.all(promises);
        return article_list;
    }

    async getUserInterestedArticleList(user_id, lm, page_size){
        const article_list = await this._getUserInterestedArticleList(user_id, lm, page_size);
        return {
            article_list: article_list,
            lm: article_list.length ? article_list[article_list.length - 1].publishTime : null,
            ps: page_size
        }
    }

    async _getUserInterestedArticleList(user_id, lm, page_size){
        //获取用户有过交互的标签
        const tag_list = await this.getTagSeen(user_id);
        //获取相应标签的文章
        let sql = this.sqlGetArticleInTag(tag_list,lm, page_size);
        const article_list = await this.model.query(sql,{type: this.model.QueryTypes.SELECT});
        //过滤已读的
        await this.ctx.helper.remove(article_list,async (article)=>{
            return await this.service.article.record.isRead(user_id, article.id);
        });
        //数量不足，从不在标签列表的文章中补充
        if(article_list.length < page_size){
            sql = this.sqlGetArticleNotInTag(tag_list,lm, page_size - article_list.length);
            const other_article_list = await this.model.query(sql,{type: this.model.QueryTypes.SELECT});
            await this.ctx.helper.remove(other_article_list,async (article)=>{
                return await this.service.article.record.isRead(user_id, article.id);
            });
            this.ctx.helper.concat(article_list,other_article_list);
        }

        const promises = article_list.map(async (article)=>{
            article.tagList = await this.service.tag.web.view.getArticleRelateTagList(article.id);
        });
        await Promise.all(promises);
        return article_list;
        //加工，返回
    }

    sqlGetArticleInTag(tag_list,lm, page_size){
        return this.knex
            .select( 'article_list.id','article_list.title','article_list.summary','article_list.cover','article_list.viewsCount','article_list.publishTime')
            .from(function (){
                this
                    .distinct('rel.article_id')
                    .from({rel: 'xd_xd_article_tag_rel'})
                    .whereIn('rel.tag_id',tag_list)
                    .groupBy('rel.article_id','rel.tag_id')
                    .as('id_list')
            })
            .join({article_list: 'xd_xd_vi_client_article_list'},'id_list.article_id','article_list.id')
            .where('article_list.publishTime', '<', this.ctx.helper.getYMDhms(lm))
            .limit(page_size)
            .orderBy('article_list.publishTime','DESC')
            .toString();
    }

    sqlGetArticleNotInTag(tag_list,lm, page_size){
        return this.knex
            .select( 'article_list.id','article_list.title','article_list.summary','article_list.cover','article_list.viewsCount','article_list.publishTime')
            .from({article_list: 'xd_xd_vi_client_article_list'})
            .whereNotIn('article_list.id',function (){
                this
                    .distinct('rel.article_id')
                    .from({rel: 'xd_xd_article_tag_rel'})
                    .whereIn('rel.tag_id',tag_list)
            })
            .where('article_list.publishTime', '<', this.ctx.helper.getYMDhms(lm))
            .limit(page_size)
            .orderBy('article_list.publishTime','DESC')
            .toString();
    }

    async getTagSeen(user_id){
        const history_list = await this.model.XdXdRecordArticleView.findAll({
            where: {
                user_id: user_id,
                duration_time: {$gte: 300}
            },
            attributes: ['article_id'],
            raw: true
        });
        const article_id_list =  this.ctx.helper._.pluck(history_list, 'article_id');
        const tag_obj_list = await this.model.XdXdArticleTagRel.findAll({
            where: {
                article_id: {$in:article_id_list}
            },
            attributes: ['tag_id'],
            raw: true
        });
        return this.ctx.helper._.uniq((this.ctx.helper._.pluck(tag_obj_list, 'tag_id')));
    }

}

module.exports = ArticleService;
