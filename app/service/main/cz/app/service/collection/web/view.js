const Service = require('../../../core/service/ApiService');


class CollectionService extends Service {


    async getCollectionList(user_id, folder, ps, lm) {
        try {
            const dao = this.service.collection.web.dao;
            const collList = await dao.collection.getCollectionListByUserId(user_id, folder, lm, ps);

            const promises = collList.map(async (coll)=>{
                switch (coll.coll_type) {
                    case this.constant.COLLECTION_TYPE.ARTICLE:
                        const article = await this.service.article.common.getArticleMetaById(coll.item_id);
                        coll.cover = article.cover_url;
                        coll.coll_name = article.title;
                        break;
                    case this.constant.COLLECTION_TYPE.TOPIC:
                        const topic = await this.service.topic.common.getTopicByTopicId(coll.item_id);
                        coll.cover = topic.cover;
                        coll.coll_name = topic.title;
                        break;
                }
            });
            await Promise.all(promises);
            return {
                list: collList,
                lm: collList.length ? collList[collList.length - 1].modify_time : null
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getArticleCollectionCount(article_id){
        return await this.model.XdXdCollection.count({where: article_id});
    }


}

module.exports = CollectionService;
