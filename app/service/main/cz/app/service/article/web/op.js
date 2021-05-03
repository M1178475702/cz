const Service = require('../../../core/service/ApiService');
const moment = require('moment');


class ArticleService extends Service {

    //喜欢/不喜欢
    async doAttitude(user_id, article_id, like_degree) {
        const t = await this.getTransaction();
        try {
            const like_record = await this.service.article.record.getRecordArticleAttitude(user_id, article_id);

            let points_value = 5;
            let added_points = 0;
            if(!like_record){
                await this.model.XdXdRecordArticleAttitude.create({
                    user_id: user_id,
                    article_id: article_id,
                    degree: like_degree
                },{
                    transaction: t
                });
                added_points = await this.service.bonusPoints.common.editBonusPoints(user_id, this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_DO_ATTITUDE, points_value)
            }
            else{
                await this.model.XdXdRecordArticleAttitude.update({
                    degree: like_degree
                },{
                    where: {
                        id: like_record.id
                    },
                    transaction: t
                })
            }

            await this.commit();
            return {
                addedPoints: added_points
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //喜欢/不喜欢
    // async doAttitude(userId, articleId, status) {
    //     const t = await this.getTransaction();
    //     try {
    //         const recordLike = await this.service.article.record.getRecordArticleAttitude(userId, articleId);
    //         const updateAttr = {};
    //
    //         switch (status) {
    //             case this.constant.ARTICLE_ATTITUDE.LIKE:
    //                 updateAttr.likes_count = this.model.literal(`likes_count + 1`);
    //                 if (recordLike) {
    //                     if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.GENERAL)
    //                         updateAttr.general_count = this.model.literal(`general_count - 1`);
    //                     else if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.UNLIKE)
    //                         updateAttr.unlikes_count = this.model.literal(`unlikes_count - 1`);
    //                 }
    //                 break;
    //             case this.constant.ARTICLE_ATTITUDE.GENERAL:
    //                 updateAttr.general_count = this.model.literal(`general_count + 1`);
    //                 if (recordLike) {
    //                     if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.LIKE)
    //                         updateAttr.likes_count = this.model.literal(`likes_count - 1`);
    //                     else if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.UNLIKE)
    //                         updateAttr.unlikes_count = this.model.literal(`unlikes_count - 1`);
    //                 }
    //                 break;
    //             case this.constant.ARTICLE_ATTITUDE.UNLIKE:
    //                 updateAttr.unlikes_count = this.model.literal(`unlikes_count + 1`);
    //                 if (recordLike) {
    //                     if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.LIKE)
    //                         updateAttr.likes_count = this.model.literal(`likes_count - 1`);
    //                     else if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.GENERAL)
    //                         updateAttr.general_count = this.model.literal(`general_count - 1`);
    //                 }
    //                 break;
    //             case this.constant.ARTICLE_ATTITUDE.NOTHING:
    //                 updateAttr.general_count = this.model.literal(`unlikes_count + 1`);
    //                 if (recordLike) {
    //                     if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.LIKE)
    //                         updateAttr.likes_count = this.model.literal(`likes_count - 1`);
    //                     else if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.GENERAL)
    //                         updateAttr.general_count = this.model.literal(`general_count - 1 `);
    //                     else if (recordLike.attitude === this.constant.ARTICLE_ATTITUDE.UNLIKE)
    //                         updateAttr.unlikes_count = this.model.literal(`unlikes_count - 1`);
    //                 }
    //                 break;
    //         }
    //         let pointsValue = 5;
    //         let addedPoints = 0;
    //         if (!recordLike) {
    //             await Promise.all([
    //                 this.model.XdXdArticleDynamicProp.update(
    //                     updateAttr,
    //                     {where: {article_id: articleId}, transaction: t}
    //                 ),
    //                 this.model.XdXdRecordArticleAttitude.create(
    //                     {attitude: status, article_id: articleId, user_id: userId},
    //                     {transaction: t}
    //                 ),
    //                 addedPoints = await this.service.bonusPoints.common.editBonusPoints(userId, this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_DO_ATTITUDE, pointsValue)
    //             ])
    //         } else {
    //             await Promise.all([
    //                 this.model.XdXdArticleDynamicProp.update(
    //                     updateAttr,
    //                     {where: {article_id: articleId}, transaction: t}
    //                 ),
    //                 this.model.XdXdRecordArticleAttitude.update(
    //                     {attitude: status, article_id: articleId, user_id: userId},
    //                     {where: {article_id: articleId, user_id: userId}, transaction: t}
    //                 )
    //             ]);
    //         }
    //         await this.commit();
    //         return {
    //             addedPoints: addedPoints
    //         }
    //     }
    //     catch (error) {
    //         await this.rollback();
    //         throw error;
    //     }
    // }

    //分享
    async doShare(userId, articleId) {
        //TODO 即使没有显式使用事务，仍需要声明事务，将事务的控制权控制在主程序上
        const t = await this.getTransaction();
        try {
            await this.service.article.record.createRecordShareArticle(userId, articleId);
            // await this.service.bonusPoints.editBonusPoints(userId, this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_DO_SHARE, 10);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

}

module.exports = ArticleService;
