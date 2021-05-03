const Service = require('../../../../core/service/ApiService');


class CollectionDao extends Service {

    async getCollectionByOTU(item_id, coll_type, user_id){
        return this.model.XdXdCollection.findOne({
            where: {
                item_id: item_id,
                coll_type: coll_type,
                user_id: user_id
            }
        })
    }

    async createCollection(user_id, coll_name, item_id, coll_type, belong_to, status){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdCollection.create(
                {
                    user_id: user_id,
                    coll_name: coll_name,
                    item_id: item_id,
                    coll_type: coll_type,
                    belong_to: belong_to,
                    status: status
                },
                {transaction: t}
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async upCollection(coll_id, status){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdCollection.update({
                status: status
            },{
                where: {
                    coll_id: coll_id
                },
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async incrementUserCollCount(user_id, value = 1){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdUser.update({
                coll_count: this.model.literal(`coll_count + ${value}`)
            },{
                where: {
                    user_id: user_id
                },
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async incrementArticleCollCount(article_id, value = 1){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdArticleDynamicProp.update({
                coll_count: this.model.literal(`coll_count + ${value}`)
            },{
                where: {
                    article_id: article_id
                },
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async incrementTopicCollCount(topic_id, value = 1){
        const t = await this.getTransaction();
        try{
            await this.model.XdXdTopic.update({
                coll_count: this.model.literal(`coll_count + ${value}`)
            },{
                where: {
                    topic_id: topic_id
                },
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async getCollectionListByUserId(user_id, folder, lm, ps){
        const where = {
            user_id: user_id,
            belong_to: folder,
            status: this.constant.COLLECTION_STATUS.DO,
            modify_time: {$lt: lm}
        };

        return this.model.XdXdCollection.findAll({
            where: where,
            limit: ps,
            order: [['modify_time', 'DESC']],
            attributes: ['coll_id', 'item_id', 'coll_type', 'coll_name', 'modify_time'],
            raw: true
        });
    }

    async getCollectionByUIT(user_id, item_id, coll_type){
        return this.model.XdXdCollection.findOne({
            where: {
                user_id: user_id,
                item_id: item_id,
                coll_type: coll_type,
                status: this.constant.COLLECTION_STATUS.DO,
            }
        });
    }
}

module.exports = CollectionDao;
