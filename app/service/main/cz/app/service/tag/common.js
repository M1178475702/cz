const Service = require('../../core/service/ApiService');

class TagService extends Service {

    async getTagByName(name) {
        return await this.model.XdXdTag.findOne({
            where:{
                name: name
            }
        })
    }

    async getTagById(id){
        return await this.model.XdXdTag.findOne({
            where:{
                tag_id: id
            },
            attributes: [['tag_id','id'],'name','status',['created_by','createdBy'],['create_time','ctime']],
            raw: true,
        })
    }

}

module.exports = TagService;
