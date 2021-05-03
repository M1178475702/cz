const Service = require('../../../core/service/ApiService');

class TagClassService extends Service {

    async createTagClassRel(tag_class_id, tag_id){
        const t  = await this.getTransaction();
        try{
            await this.model.XdXdTagClassRel.create({
                tag_class_id: tag_class_id,
                tag_id: tag_id
            },{
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async getTagClassAndTagList(){
        const tag_class_list = await this.getTagClassList();
        const promises = tag_class_list.map(async (tag_class) =>{
            tag_class.tag_list  = await this.getTagByTagClassId(tag_class.tag_class_id);
        });
        await Promise.all(promises);
        return {
            tag_class_list: tag_class_list
        };
    }



    async getTagClassList(){
        return this.model.XdXdTagClass.findAll({
            where: {
                status: 1
            },
            attributes: {exclude: ['status']},
            raw: true
        })
    }

    async getTagByTagClassId(tag_class_id){
        const sql = this.knex
            .select('tag.tag_id','tag.name')
            .from({tag:'xd_xd_tag'})
            .join({rel: 'xd_xd_tag_class_rel'}, 'rel.tag_id','tag.tag_id')
            .where('rel.tag_class_id', '=', tag_class_id)
            .where('tag.status', '=', 11)
            .toString();
        return this.model.query(sql, {type: this.model.QueryTypes.SELECT});
    }

}

module.exports = TagClassService;
