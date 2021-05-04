const Service = require('../../../core/service/ApiService');

class UserCenterService extends Service {

    async getUserCenterContent(user_id) {
        const promises = this.ctx.helper.getPromises();
            promises.push(this.getUserViewDurationRank(user_id));
        promises.push(this.getViewHistoryRecord(user_id, new Date(), 5));
        promises.push(this.getUserInfoAndPoints(user_id));
        promises.push(this.service.collection.rpc.getCollectionList(user_id, 0, 5, new Date()));
        const [rank, history, user_info, collection] = await promises.execute();
        return {
            rank: rank,
            history: history,
            collection: collection.list,
            user_info: user_info.user_info,
            points: user_info.points
        }
    }

    //获取用户排名
    async getUserViewDurationRank(user_id) {
        const self_rank = await this.model.XdXdRankViewDuration.findOne({
            where: {
                user_id: user_id
            },
            raw: true
        });
        if (!self_rank)
            return {
                rank: null,
                score: null
            };
        const rank_list = await this.model.XdXdRankViewDuration.findAll({
            order: [['view_duration', 'DESC']],
            limit: 30,
            raw: true
        });
        const rank = this.getUserRank(rank_list, self_rank.view_duration);
        return {
            rank: rank,
            score: self_rank.view_duration
        }
    }

    //获取历史记录
    async getViewHistoryRecord(user_id, lm, page_size) {
        return await this.model.XdXdViRecordArticleView.findAll({
            where: {
                user_id: user_id,
                create_time: {$lt: lm}
            },
            attributes: ['article_id', 'title', 'create_time'],
            order:[['create_time','DESC']],
            limit: page_size,
            raw: true
        })
    }

    //收藏
    async getCollectionList(userId, folder, pageSize) {
        try {
            const where = {
                user_id: userId,
                belong_to: folder,
                status: this.constant.COLLECTION_STATUS.DO
            };
            const collList = await this.model.XdXdCollection.findAll({
                where: where,
                limit: pageSize,
                order: [['modify_time', 'DESC']],
                attributes: ['coll_id', 'item_id', 'modify_time'],
                raw: true
            });
            for (const collection of collList) {
                const article = await this.model.XdXdArticle.findOne({
                    where: {article_id: collection.articleId},
                    raw: true
                });
                collection.title = article.title;
            }
            return collList;
        }
        catch (error) {
            throw error;
        }
    }

    //个人信息
    async getUserInfoAndPoints(user_id) {
        const user = await this.model.XdXdUser.findOne({
            where: {
                user_id: user_id
            },
            attributes: ['name', 'mobile', 'bonus_points', 'user_number', 'avatar'],
            raw: true
        });
        const todaySumOfPoints = await this.service.bonusPoints.common.getTodaySumOfAddedPoints(user_id);
        return {
            points: {
                value: user.bonus_points,
                today: todaySumOfPoints
            },
            user_info: {
                name: user.name,
                mobile: user.mobile,
                user_number: user.user_number,
                avatar: user.avatar
            }
        }
    }


    getUserRank(rank_list, score) {
        const index = this.ctx.helper.binary_search(rank_list, score, (left, right) => {
            if (left < right.view_duration)
                return 1;
            else if (left === right.view_duration)
                return 0;
            else if (left > right.view_duration)
                return -1;
        });
        if (index === -1)
            return null;
        else
            return index + 1;

    }

}

module.exports = UserCenterService;
