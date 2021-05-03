const Service = require('../../../core/service/ApiService');

class UserHistoryService extends Service {

    //获取历史记录
    async getViewHistoryRecord(user_id, lm, page_size) {
        const history_list =  await this.model.XdXdViRecordArticleView.findAll({
            where: {
                user_id: user_id,
                create_time: {$lt: lm}
            },
            attributes: ['article_id', 'title','cover','summary','create_time'],
            order:[['create_time','DESC']],
            limit: page_size,
            raw: true
        });
        return {
           history_list: history_list,
           lm: history_list.length ? history_list[history_list.length - 1].create_time : null
        }
    }


}

module.exports = UserHistoryService;
