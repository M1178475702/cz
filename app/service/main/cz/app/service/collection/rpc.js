const Service = require('../../core/service/ApiService');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');
const path = require("path")

const packageDefinition = protoLoader.loadSync(path.resolve(process.cwd(),"api/v1/collection.proto"), null);
const tmp =  grpc.loadPackageDefinition(packageDefinition);
const collection_proto = tmp['cz']['collection']['v1'];

class CollectionService extends Service {
    constructor(self) {
        super(self);
        this.collectionRPC = new collection_proto.Collection(this.app.config.rpc.collectionClient.addr, grpc.credentials.createInsecure());
    }
    async getCollectionList(userId, folder, ps, lm){
        return new Promise((resolve, reject) => {
            this.collectionRPC.GetCollectionList({
                userId: userId,
                folder: folder,
                ps: ps,
                lm: this.helper.getYMDhms(lm),
            }, (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    }

    async isCollected(userId, itemId, collType) {
        return new Promise((resolve, reject) => {
            this.collectionRPC.isCollected({
                userId: userId,
                itemId: itemId,
                collType: collType,
            }, (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(res.isCollected)
            })
        })
    }

}

module.exports = CollectionService