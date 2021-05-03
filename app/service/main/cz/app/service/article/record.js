const Service = require('../../core/service/ApiService');


class WebArticleRecordService extends Service {

    async isRead(user_id, article_id) {
        const record = await this.model.XdXdRecordArticleView.findOne({
            where: {
                user_id: user_id,
                article_id: article_id
            },
            attributes: ['id'],
            raw: true
        });
        return record ? 1 : 0;
    }

    //创建浏览记录
    async createRecordView(userId, articleId, src) {
        const t = await this.getTransaction();
        try {
            //仅第一次浏览时，增加浏览数量
            const isViewed = await this.model.XdXdRecordArticleView.findOne({
                where: {
                    user_id: userId,
                    article_id: articleId
                }, raw: true
            });
            if (!isViewed)
                await this.model.XdXdUser.update({view_count: this.model.literal(`view_count + 1`)}, {
                    where: {user_id: userId},
                    transaction: t
                });
            await Promise.all([
                this.model.XdXdRecordArticleView.create(
                    {article_id: articleId, user_id: userId, duration_time: 0, src: src},
                    {transaction: t}
                ),
                this.model.XdXdArticleDynamicProp.update(
                    {views_count: this.model.literal(`views_count + 1`)},
                    {where: {article_id: articleId}, transaction: t}
                )
            ]);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //更新浏览时长,可累积,一定时长添加积分
    async updateViewDuration(userId, articleId, duration) {
        const t = await this.getTransaction();
        try {
            //找到浏览记录中最新的，为当前浏览会话
            const record = await this.model.XdXdRecordArticleView.findOne({
                where: {article_id: articleId, user_id: userId},
                order: [['create_time', 'DESC']],
            });
            if (!record) throw new this.error.InvalidError('没有浏览记录');

            //TODO  int一下，保险，曾经出错过
            const curDur = parseInt(record.get('duration_time')) + duration;
            let addPoints = 0;
            let todayReasonCount = -1;   //-1表示未知
            //大于600s(10分钟)不增加
            const begin = this.ctx.helper.farawayDays(0);
            //TODO  每篇文章每天有效时间最多5分钟
            const articleTodayViewDur = await this.getSumViewDuration(userId, begin, null, articleId);

            if (articleTodayViewDur < 300) {
                const user = await this.service.user.common.findUserObjById(userId);
                if (!user) throw new this.error.InvalidError('无效用户');
                //await this.service.userRank.viewDurationRank.updateViewDurationRank(userId, duration, user.user_role);

                //当篇文章阅读时长当天阅读记录大于等于20
                if (curDur >= 20) {
                    const reason = this.constant.BONUS_POINTS_EDIT_REASON.DAY_TASK_SINGLE_READ_TIME_SPENT_20;
                    todayReasonCount = await this.service.bonusPoints.common.getReasonCount(userId, reason, begin);
                    //TODO 今天加分次数不超过3次
                    if (todayReasonCount < 3) {
                        const todayTheArticleViewCount = await this.model.XdXdRecordArticleView.count({
                            where: {
                                article_id: articleId,
                                user_id: userId,
                                duration_time: {$gte: 20},
                                create_time: {$gte: begin}
                            }
                        });
                        //今日该篇文章没有加分
                        if (todayTheArticleViewCount === 0) {
                            if (todayReasonCount > 0)
                                addPoints = 10;
                            else
                                addPoints = 5;
                            await this.service.bonusPoints.common.editBonusPoints(user, reason, addPoints);
                            ++todayReasonCount;
                        }
                    }
                }
                await record.update({duration_time: this.model.literal(`duration_time + ${duration}`)}, {transaction: t});
            }
            await this.commit();
            return {
                addedPoints: addPoints,
                reasonCount: todayReasonCount,
                isFull: articleTodayViewDur >= 300 ? 1 : 0               //新增：阅读时长是否超过10分钟
            };
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //获取总浏览时长
    async getSumViewDuration(userId, begin, end, articleId) {
        const where = {user_id: userId};
        if (begin && !end)
            where.create_time = {$gte: begin};
        else if (begin && end)
            where.create_time = {$between: [begin, end]};
        if (articleId)
            where.article_id = articleId;
        return await this.model.XdXdRecordArticleView.sum('duration_time', {
            where: where,
            group: 'user_id'
        })
    }

    async getUserViewRecordList(user_id, ps, begin, end) {
        const findOpt = {
            where: {
                user_id: user_id
            },
            order: [['create_time','DESC']],
        };
        if(ps)
            findOpt.limit = ps;
        if(begin && !end){
            findOpt.where.create_time = {$gte: begin};
        } else if (begin && !end) {
            findOpt.where.create_time = {$lte: begin};
        }else if(begin && end){
            findOpt.where.create_time = {$between: [begin, end]}
        }
        return await this.model.XdXdRecordArticleView.findAll(findOpt)
    }


    //创建文章分享记录
    async createRecordShareArticle(userId, articleId) {
        const t = await this.getTransaction();
        try {
            await Promise.all([
                this.model.XdXdRecordShare.create({
                    user_id: userId,
                    article_id: articleId
                }, {transaction: t}),
                this.model.XdXdArticleDynamicProp.update(
                    {share_count: this.model.literal(`share_count + 1`)},
                    {where: {article_id: articleId}, transaction: t}
                )
            ]);
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //获取用户对待文章的态度记录
    async getRecordArticleAttitude(userId, articleId) {
        return await this.model.XdXdRecordArticleAttitude.findOne({
            where: {user_id: userId, article_id: articleId},
            raw: true,
        });
    }

}

module.exports = WebArticleRecordService;
