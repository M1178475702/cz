const Service = require('../../../core/service/ApiService');

class LoginService extends Service{

    async loginFromOtherSystem(wxcode, from){
        const t = await this.getTransaction();
        try{
            const wxapp = this.app.wxapps.getApp(11);
            let {openid, access_token, isAuth} = await wxapp.getWxAccessToken(wxcode);
            let user = await this.service.user.common.findUserByOpenid(openid);
            if (!user){ //底栏
                if(from == 1)
                    user = await this.service.user.web.login.register(openid, access_token, isAuth, 11);
                else {
                	this.ctx.logger.info(from);
                    await this.commit();
                    return {
                        avatar: "",
                        nickname: "",
                        isAuth: false,
                        openId: openid,
                        isFollow: false
                    }
                }
            }

            let status = user.status;
            let userInfo = user.get();
            if(isAuth){
                userInfo = await this.service.user.web.login.afterAuthenticated(user, access_token, openid, 11, status);
            }
            if (!this.ctx.session.userId)
                await this.service.user.record.createRecordUserLogin(user.get('user_id'), this.ctx.ip, 11);
            // const isFollow = await wxapp.isFollowOfficeAccount(openid);
            await this.commit();
            return {
                avatar: userInfo.avatar,
                nickname: userInfo.name,
                isAuth: !!isAuth,
                openId: openid,
                isFollow: true
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }
}

module.exports = LoginService;
