const Service = require('../../../core/service/ApiService');

class ArticleTagRelService extends Service {

    async createTag(tagInfo) {
        const t = await this.getTransaction();
        try {
            const isExist = await this.service.tag.common.getTagByName(tagInfo.name);
            let temp,tag;
            if (isExist && isExist.status === 11){
                throw new this.error.CommonError('该标签已被定义');
            } else if(isExist && isExist.status === 10){
                await this.model.XdXdTag.update({
                    status: 11
                },{
                    where: {
                        tag_id: isExist.tag_id
                    },
                    transaction: t
                });
                temp = isExist;
            }else{
                temp = await this.model.XdXdTag.create(
                    {
                        name: tagInfo.name,
                        created_by: this.ctx.session.adminId,
                        status: 11
                    },
                    {
                        attributes: ['id', 'name', 'status'],
                        transaction: t, raw: true
                    }
                );
            }

            tag = {
                id: temp.tag_id,
                name: temp.name,
                status: temp.status
            };

            await this.commit();
            return tag;
        }
        catch (error) {
            await this.rollback();
            throw  error;
        }

    }

    async editTag(tagInfo) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdTag.update(
                {
                    name: tagInfo.name,
                    status: tagInfo.status
                }, {
                    where: {tag_id: tagInfo.id},
                    transaction: t
                }
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async deleteTag(tagId) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdTag.update({
                status: 10
            },{
                where: {tag_id: tagId},
                transaction: t
            });
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}

module.exports = ArticleTagRelService;
