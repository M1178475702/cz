const Controller = require('../../core/controller/ApiController');

class UserRankController extends Controller{

    async getBonusPointsRankList(){
        try{
            const rule = {
                size: {type: 'int?',default:5}
            };
            this.validate(rule,this.ctx.request.query);
            this.result.data = await this.service.userRank.bonusPointsRank.getWebUserBonusPointsRankList(this.ctx.request.query.size);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async createBonusPointsRank(){
        try{
            await this.service.userRank.bonusPointsRank.syncAllRank();
            this.success()
        }
        catch (error) {
            this.handleError(error);
        }

    }

    async getViewDurationRankList(){
        try{
            const rule = {
                size: {type: 'int?',default:5}
            };
            this.validate(rule,this.ctx.request.query);
            this.result.data = await this.service.userRank.viewDurationRank.getWebUserViewDurationRankList(this.ctx.request.query.size);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async createViewDurationRank(){
        try{
            await this.service.userRank.viewDurationRank.syncAllRank();
            this.success()
        }
        catch (error) {
            this.handleError(error);
        }

    }

}

module.exports = UserRankController;
