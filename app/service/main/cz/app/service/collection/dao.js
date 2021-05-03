const Service = require('../../core/service/ApiService');


class CollectionService extends Service {
    async getCollectionByOTU(item_id, coll_type, user_id){
        return this.model.XdXdCollection.findOne({
            where: {
                item_id: item_id,
                coll_type: coll_type,
                user_id: user_id
            }
        })
    }
}

module.exports = CollectionService;
