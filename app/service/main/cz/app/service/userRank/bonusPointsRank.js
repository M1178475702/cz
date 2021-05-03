const Service = require('../../core/service/ApiService');
const moment = require('moment');


class UserBonusPointsRankService extends Service {

    //value: 新增积分值
    async updateBonusPointsRank(rank, value) {
        const t = await this.getTransaction();
        //先查询,更新值，排序
        //先计算值，然后查出比这个score大的人，将该区间的人名次都-1，原名次以下不需要操作
        try {
            let selfRank;
            if (!this.ctx.helper.isObject(rank))
                selfRank = await this.findUserCurrentBonusPointsRank(rank);
            else
                selfRank = rank;
            if(selfRank === null) throw new this.error.InvalidError('无效RANK记录');

            // const curBp = parseInt(selfRank.get('bonus_points')) + value;
            // let newRank = selfRank.get('rank');
            // const largeRanks = await this.model.XdXdRankBonusPoints.findAll({
            //     where: {
            //         bonus_points: {$lt: curBp, $gte: selfRank.get('bonus_points')},
            //         rank: {$lt: newRank},
            //         user_id: {$not: selfRank.get('user_id')}
            //     },
            //     order: [['rank', 'ASC']],
            // });
            // if (largeRanks.length) {
            //     newRank = largeRanks[0].get('rank');
            //     await selfRank.update({bonus_points: curBp, rank: newRank}, {transaction: t});
            //     for  await (let rank of largeRanks) {
            //         rank.update({rank: this.model.literal('rank + 1')}, {transaction: t});
            //     }
            // } else {
            //     await selfRank.update({bonus_points: curBp}, {transaction: t});
            // }
            await selfRank.update({bonus_points: this.model.literal(`bonus_points + ${value}`)}, {transaction: t});
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //查找用户当前阅读时长排名
    async findUserCurrentBonusPointsRank(userId, isUseView) {
        if (isUseView)
            return await this.model.XdXdViRankBonusPointsCur.findOne({where: {userId: userId}});
        else
            return await this.model.XdXdRankBonusPoints.findOne({where: {user_id: userId}})
    }

    async getWebUserBonusPointsRankList(size) {
        const list = await this.getBonusPointsRankList('cur', size, 0);
        // const self = await this.findUserCurrentBonusPointsRank(this.ctx.session.userId, true);
        let self = null;
        for(let i = 0;i < list.length;++i){
            list[i].rank = i + 1;
            if(list[i].userId === this.ctx.session.userId){
                self = list[i];
            }
        }
        return {
            list: list,
            self: self
        }
    }

    //外部接口，可选择查看范围内排行榜，range： day,week,month
    async getBonusPointsRankList(range, size, offset) {
        switch (range) {
            case 'cur':
                return await this.getCurrentBonusPointsRankList(size, offset);
            case 'last':
                break;
            case 'month':
                break;
        }
    }

    //获取当前积分排名榜
    async getCurrentBonusPointsRankList(size, offset) {
        return await this.model.XdXdViRankBonusPointsCur.findAll({
            where: {userStatus: 2},
            attributes: {exclude: ['userStatus']},
            offset: offset,
            limit: size,
            order: [['bp', 'DESC'], ['mtime', 'ASC']],
            raw: true
        })
    }

    //新用户进来即创建,dur为已有dur
    async syncAllRank() {
        // const t = await this.getTransaction();
        try {
            const allUser = await this.model.XdXdUser.findAll({
                where: {status: 2},
                attributes: ['user_id'],
                raw: true
            });
            for (let user of allUser) {
                await this.createCurBonusPointsRank(user.user_id);
            }
            // await this.commit();
        }
        catch (error) {
            // await this.rollback();
            throw error;
        }
    }

    async createCurBonusPointsRank(userId) {
        const t = await this.getTransaction();
        try {
            //同步数据
            let value = 0;
            let weeknum = 0;
            const end = new Date();
            if (end.getDay() <= 4 && end.getDay() !== 0)
                weeknum = 1;
            const begin = this.ctx.helper.weekday(weeknum, 4, 3);
            const records = await this.model.XdXdRecordBonusPoints.findAll({
                where: {
                    user_id: userId,
                    create_time: {$between: [begin, end]}
                },
                raw: true
            });
            for (let record of records) {
                value += record.value;
            }
            // let maxRank = await this.model.XdXdRankBonusPoints.max('rank');
            let maxRank = 1;
            const rank = await this.model.XdXdRankBonusPoints.create(
                {user_id: userId, rank: ++maxRank},
                {transaction: t}
            );
            await this.updateBonusPointsRank(rank, value);
            // await t.commit();
            //在新纪录上，此时已有value属于新增
            await this.commit();
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //保存一定时间段的排名快照
    async saveSnapshotBonusPointsRank(t) {
        try {
            const list = await this.model.XdXdRankBonusPoints.findAll({raw: true});
            const now = new Date();
            for await (let ele of list) {
                this.model.XdXdRecordRankBonusPoints.create(
                    {
                        user_id: ele.user_id,
                        bonus_points: ele.bonus_points,
                        rank: ele.rank,
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
            await this.app.model.XdXdRankBonusPoints.update(
                {bonus_points: 0},
                {where: {}, transaction: t}
            );
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = UserBonusPointsRankService;
