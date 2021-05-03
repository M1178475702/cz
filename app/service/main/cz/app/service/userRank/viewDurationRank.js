const Service = require('../../core/service/ApiService');
const moment = require('moment');


class UserViewDurationRankService extends Service {

    //dur: 新增阅读时长
    async updateViewDurationRank(rank, dur, role) {
        if(!this.isRank(role))
            return;
        const t = await this.getTransaction();
        //先查询,更新值，排序
        //先计算值，然后查出比这个score大的人，将该区间的人名次都-1，原名次以下不需要操作
        try {
            let selfRank;
            if (!this.ctx.helper.isObject(rank))
                selfRank = await this.findUserCurrentViewDurationRank(rank);
            else
                selfRank = rank;
            if (!selfRank) {
                throw new this.error.InvalidError('无效记录');
            }
            //TODO 事务中途return ，一定要commit！！
            // const curDur = parseInt(selfRank.get('view_duration')) + dur;
            //当前rank
            // let newRank = selfRank.get('rank');
            //获取超过的人
            // const largeRanks = await this.model.XdXdRankViewDuration.findAll({
            //     where: {
            //         view_duration: {$lt: curDur, $gte: selfRank.get('view_duration')},
            //         rank:{$lt:newRank},
            //         user_id: {$not: selfRank.get('user_id')}
            //     },
            //     order: [['rank', 'ASC']],
            // });
            //如果存在
            // if (largeRanks.length) {
            //     //升序，第一个人的rank就是newRank
            //     newRank = largeRanks[0].get('rank');
            //     await selfRank.update({view_duration: curDur, rank: newRank},{transaction: t});
            //     //其余的全部rank + 1（下降）
            //     //TODO for await 并没有起到应有的效果
            //     let idArr = [];
            //     idArr.push();
            //     for (let rank of largeRanks) {
            //
            //         rank.update({rank: this.model.literal('rank + 1')}, {transaction: t});
            //     }
            // } else {
            //     //如果不存在，只更新时长，不更新rank
            //     await selfRank.update({view_duration: curDur}, {transaction: t});
            // }
            await selfRank.update({view_duration: this.model.literal(`view_duration + ${dur}`)}, {transaction: t});
            await this.commit();
            // return newRank;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }



    //查找用户当前阅读时长排名
    async findUserCurrentViewDurationRank(userId, isUseView) {
        if (isUseView)
            return await this.model.XdXdViRankViewDurationCur.findOne({where: {userId: userId}});
        else
            return await this.model.XdXdRankViewDuration.findOne({where: {user_id: userId}})
    }

    async getWebUserViewDurationRankList(size) {
        const list = await this.getViewDurationRankList('cur', size, 0);
        // const self = await this.findUserCurrentViewDurationRank(this.ctx.session.userId, true);
        let self = null;
        for (let i = 0; i < list.length; ++i) {
            list[i].rank = i + 1;
            if (list[i].userId === this.ctx.session.userId) {
                self = list[i];
            }
        }
        return {
            list: list,
            self: self
        }
    }

    //外部接口，可选择查看范围内排行榜，range： day,week,month
    async getViewDurationRankList(range, size, offset) {
        switch (range) {
            case 'cur':
                return await this.getCurrentViewDurationRankList(size, offset);
            case 'week':
                break;
            case 'month':
                break;
        }
    }

    //获取当前阅读时长排名榜
    async getCurrentViewDurationRankList(size, offset) {
        offset = 0;
        return await this.model.XdXdViRankViewDurationCur.findAll({
            where: {userStatus: 2},
            attributes: {exclude: ['userStatus']},
            offset: offset,
            limit: size,
            order: [['dur', 'DESC'], ['mtime', 'ASC']],
            raw: true
        })
    }

    //新用户进来即创建,dur为已有dur
    async createCurViewDurationRank(userId, role) {
        if(!this.isRank(role))
            return;

        const t = await this.getTransaction();
        try {
            //同步数据
            let value = 0;
            let weeknum = 0;
            const end = new Date();
            if (end.getDay() <= 4 && end.getDay() !== 0)
                weeknum = -1;
            const begin = this.ctx.helper.weekday(weeknum, 4, 3);
            //统计已有的总阅读时长
            const records = await this.model.XdXdRecordArticleView.findAll({
                where: {
                    user_id: userId,
                    create_time: {$between: [begin, end]}
                },
                raw: true
            });
            for (let record of records) {
                value += record.duration_time;
            }
            let maxRank = 1;
            // let maxRank = await this.model.XdXdRankViewDuration.max('rank');
            const rank = await this.model.XdXdRankViewDuration.create(
                {user_id: userId, rank: ++maxRank},
                {transaction: t}
            );
            await this.updateViewDurationRank(rank, value, role);
            await this.commit();
            //在新纪录上，此时已有value属于新增
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    // async syncAllRank() {
    //     const t = await this.getTransaction();
    //     try {
    //         maxRank = 1;
    //         const allUser = await this.model.XdXdUser.findAll({
    //             where:{status : 2},
    //             attributes: ['user_id'],
    //             raw: true
    //         });
    //         for (let user of allUser) {
    //             await this.createViewDurationRank(user.user_id);
    //         }
    //         await this.commit();
    //     }
    //     catch (error) {
    //         await this.rollback();
    //         throw error;
    //     }
    //
    // }

    //保存当前时间的排名快照
    async saveSnapshotViewDurationRank(t) {
        try {
            const now = new Date();
            const curList = await this.model.XdXdRankViewDuration.findAll({raw: true});

            for (let ele of curList) {
                await this.model.XdXdRecordRankViewDuration.create(
                    {
                        user_id: ele.user_id,
                        rank: ele.rank,
                        view_duration: ele.view_duration,
                        snapshot_time: now
                    },
                    {transaction: t, raw: true}
                )
            }
        }
        catch (error) {
            throw error;
        }

    }

    async resetCurRankList(t) {
        try {
            await this.app.model.XdXdRankViewDuration.update(
                {view_duration: 0},
                {where: {}, transaction: t}
            );
        }
        catch (error) {
            throw error;
        }
    }

    isRank(role){
        return !(role === this.constant.USER_ROLE.TEST || role === this.constant.USER_ROLE.UNKNOWN || role === this.constant.USER_ROLE.YOUKE);
    }

}

module.exports = UserViewDurationRankService;
