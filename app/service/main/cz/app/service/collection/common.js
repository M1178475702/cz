const Service = require('../../core/service/ApiService');


class CollectionService extends Service {

    async isCollected(item_id, coll_type, user_id){
        const coll = await this.service.collection.dao.getCollectionByOTU(item_id, coll_type, user_id);
        return !!(coll && coll.status === this.constant.COLLECTION_STATUS.DO);
    }

    async getCollection(user_id, item_id, coll_type) {
        const dao = this.service.collection.dao;
        return dao.getCollectionByOTU(item_id, coll_type, user_id);
    }

}

module.exports = CollectionService;
