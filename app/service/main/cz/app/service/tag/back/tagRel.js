const Service = require('../../../core/service/ApiService');

class ArticleTagRelService extends Service {

    async createTagRel(tag_id, rel_tag_id, relevancy) {
        const t = await this.getTransaction();
        try {

            const tag = await this.model.XdXdTagRel.create(
                {
                    rel_tag_id: rel_tag_id,
                    tag_id: tag_id,
                    relevancy: relevancy
                }, {
                    transaction: t,
                    raw: true
                }
            );
            await this.commit();

            return {
                id: tag.id,
                rel_tag_id: tag.rel_tag_id,
                tag_id: tag.tag_id,
                relevancy: tag.relevancy
            };
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    async cancelRelTagToTag(rel_id) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdTagRel.destroy({
                    where: {
                        id: rel_id
                    },
                    transaction: t,
                    raw: true
                }
            );
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }

    async editRelTag(rel_id, relevancy) {
        const t = await this.getTransaction();
        try {
            await this.model.XdXdTagRel.update({
                relevancy: relevancy
            }, {
                where: {
                    id: rel_id
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

    async getTagRelTagList(tag_id) {
        try {
            let sql = this.sqlGetTagRelTagList(tag_id);
            return await this.model.query(sql, {type: this.model.QueryTypes.SELECT})
        }
        catch (error) {
            throw error;
        }
    }

    sqlGetTagRelTagList(tag_id) {
        return this.knex
            .select('rel.id', {tag_id: 'rel.rel_tag_id'}, 'tag.name', 'rel.relevancy')
            .from({tag: 'xd_xd_tag'})
            .join({rel: 'xd_xd_tag_rel'}, 'rel.tag_id', 'tag.tag_id')
            .where('tag.status', '=', 11)
            .where('rel.tag_id', '=', tag_id)
            .union(function(){
                this
                    .select('rel.id', 'rel.tag_id', 'tag.name', 'rel.relevancy')
                    .from({tag: 'xd_xd_tag'})
                    .join({rel: 'xd_xd_tag_rel'},'rel.tag_id','tag.tag_id')
                    .where('rel.rel_tag_id','=', tag_id)
                    .where('tag.status','=',11)
            })
            .toString();
    }

}

module.exports = ArticleTagRelService;
