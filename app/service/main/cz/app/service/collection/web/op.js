const Service = require('../../../core/service/ApiService');


class CollectionService extends Service {

    async doCollect(user_id, item_id, coll_type, belongToFolder, collectionName) {
        const t = await this.getTransaction();
        try {
            const dao = this.service.collection.web.dao;
            const promises = this.helper.getPromises();

            const collection = await this.service.collection.common.getCollection(user_id, item_id, coll_type);
            if (collection)
                if(collection.status === this.constant.COLLECTION_STATUS.DO)
                    throw new this.error.CommonError('已经收藏过了');
                else
                    promises.push(dao.collection.upCollection(collection.coll_id, this.constant.COLLECTION_STATUS.DO));
            else{
                const coll_name = await this.getCollName(item_id, coll_type);
                promises.push(dao.collection.createCollection(user_id, coll_name, item_id, coll_type, belongToFolder, this.constant.COLLECTION_STATUS.DO));
            }

            promises.push(dao.collection.incrementUserCollCount(user_id, 1));
            //更新 item的coll_count
            switch (coll_type) {
                case this.constant.COLLECTION_TYPE.ARTICLE:
                    promises.push(dao.collection.incrementArticleCollCount(item_id, 1));
                    break;
                case this.constant.COLLECTION_TYPE.TOPIC:
                    promises.push(dao.collection.incrementTopicCollCount(item_id, 1));
                    break;
            }
            await promises.execute();
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async getCollName(item_id, coll_type) {
        switch (coll_type) {
            case this.constant.COLLECTION_TYPE.ARTICLE:
                const article = await this.service.article.common.getArticleMetaById(item_id);
                return article.title;
            case this.constant.COLLECTION_TYPE.TOPIC:
                const topic = await this.service.topic.common.getTopicByTopicId(item_id);
                return topic.title;
        }
    }

    //TODO 改成只传coll_id
    async undoCollect(coll_id, user_id, item_id, coll_type) {
        const t = await this.getTransaction();
        try {
            const dao = this.service.collection.web.dao;
            const promises = this.helper.getPromises();
            const collection = await dao.collection.getCollectionByUIT(user_id, item_id, coll_type);
            promises.push(dao.collection.upCollection(collection.coll_id, this.constant.COLLECTION_STATUS.UNDO));
            promises.push(dao.collection.incrementUserCollCount(user_id, -1));
            //更新 item的coll_count
            switch (coll_type) {
                case this.constant.COLLECTION_TYPE.ARTICLE:
                    promises.push(dao.collection.incrementArticleCollCount(item_id, -1));
                    break;
                case this.constant.COLLECTION_TYPE.TOPIC:
                    promises.push(dao.collection.incrementTopicCollCount(item_id, -1));
                    break;
            }
            await promises.execute();
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }


    //TODO 改成只传coll_id
    async _undoCollect(userId, itemId, itemType) {
        const t = await this.getTransaction();
        try {
            const promises = [];
            promises.push(this.model.XdXdCollection.update(
                {status: this.constant.COLLECTION_STATUS.UNDO},
                {
                    where: {
                        user_id: userId,
                        item_id: itemId,
                        coll_type: itemType,
                        status: this.constant.COLLECTION_STATUS.DO
                    },
                    transaction: t
                }
            ));
            promises.push(this.model.XdXdUser.update(
                {coll_count: this.model.literal(`coll_count - 1`)},
                {
                    where: {user_id: userId},
                    transaction: t
                }
            ));
            if (itemType === this.constant.COLLECTION_TYPE.ARTICLE) {
                promises.push(this.model.XdXdArticleDynamicProp.update(
                    {coll_count: this.model.literal(`coll_count - 1`)},
                    {
                        where: {article_id: itemId},
                        transaction: t
                    }
                ))
            }
            await Promise.all(promises);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }


}

module.exports = CollectionService;
