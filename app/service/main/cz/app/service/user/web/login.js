const Service = require('../../../core/service/ApiService');


class UserService extends Service {

    //登录 by code，src 登录来源，如公众号web，小程序
    async login(wxcode, src) {
        const t = await this.getTransaction();
        try {
            //获取公众号app
            const wxapp = this.app.wxapps.getApp(src);
            //获取openid，access_token
            let {openid, access_token, isAuth} = await wxapp.getWxAccessToken(wxcode);

            //尝试用openid查找用户
            let user = await this.service.user.common.findUserByOpenid(openid);
            if (!user)
                user = await this.register(openid, access_token, isAuth, src);
            let status = parseInt(user.get('status'));
            //新授权
            let userInfo = user.get();
            // if (isAuth && status === this.constant.USER_STATUS.REGISTERED)
            //TODO 先暂时开放每次都更新数据，来修复当前数据
            if (isAuth && user.get('name') === '游客' && openid !== 'ceshi') {
                userInfo = await this.afterAuthenticated(user, access_token, openid, src, status);
            }
            //如何session还存在，则不创建登录记录
            if (!this.ctx.session.userId)
                await this.service.user.record.createRecordUserLogin(user.get('user_id'), this.ctx.ip, src);
            //返回注册信息
            this.ctx.session.userId = user.get('user_id');
            this.ctx.session.status = isAuth ? this.constant.USER_STATUS.AUTHENTICATED : this.constant.USER_STATUS.REGISTERED;
            await this.commit();
            return {
                seskey: openid,               //暂不加密，登录态
                username: userInfo.name,
                isAuth: isAuth ? 1 : 0
            };
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //登录 by seskey
    async loginBySkey(seskey, src) {
        const t = await this.getTransaction();
        try {
            const openid = seskey;
            const user = await this.service.user.common.findUserByOpenid(openid);
            if (!user) {
                throw new this.error.InvalidError('无效凭证');
            }
            if (!this.ctx.session.userId)
                await this.service.user.record.createRecordUserLogin(user.get('user_id'), this.ctx.ip, src);
            //返回注册信息
            this.ctx.session.userId = user.get('user_id');
            this.ctx.session.status = user.get('status');
            await this.commit();
            return {
                seskey: openid,               //暂不加密，登录态
                username: user.get('name'),
                isAuth: user.get('status') === this.constant.USER_STATUS.AUTHENTICATED ? 1 : 0
            };
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //注册,仅注册一个基本用户
    async register(openid) {
        const t = await this.getTransaction();
        try {
            const user = await this.model.XdXdUser.create(
                {
                    openid: openid,
                    name: '游客',
                    avatar: this.constant.DEFAULT_USER_AVATAR,
                    gender: 0,
                    status: this.constant.USER_STATUS.REGISTERED,                            //授权
                    user_role: this.constant.USER_ROLE.YOUKE
                },
                {transaction: t, raw: true}
            );
            await this.commit();
            return user;
        }
        catch (error) {
            await this.rollback();
            throw error;
        }
    }

    //用户认证授权后
    async afterAuthenticated(user, access_token, openid, src, status) {
        const t = await this.getTransaction();
        try {
            const wxapp = this.app.wxapps.getApp(src);
            //获取微信用户信息
            const userInfo = await wxapp.getWxUserInfo(access_token, openid);

            //本地保存头像
            // userInfo.headimgurl = await this.service.upload.internetImage(userInfo.headimgurl);
            //TODO 目前用户角色写死为学生
            let role = user.get('user_role') === this.constant.USER_ROLE.YOUKE ? this.constant.USER_ROLE.STUDENT : user.get('user_role');
            //更新用户信息
            const updateAttr = {
                name: userInfo.nickname,
                avatar: userInfo.headimgurl,
                gender: parseInt(userInfo.sex) || 0,
                country: userInfo.country,
                province: userInfo.province,
                city: userInfo.city,
                status: this.constant.USER_STATUS.AUTHENTICATED,                            //授权
                user_role: role
            };
            //TODO 事务提交前并没有修改status
            //更新用户信息->认证
            await this.model.XdXdUser.update(
                updateAttr,
                {where: {user_id: user.get('user_id')}, transaction: t}
            );
            //之前没有授权
            if (status === this.constant.USER_STATUS.REGISTERED) {
                //角色为学生或老师
                await Promise.all([
                    this.service.userRank.viewDurationRank.createCurViewDurationRank(user.user_id, role)
                    // this.service.userRank.bonusPointsRank.createCurBonusPointsRank(user.get('user_id'))
                ])
            }
            await this.commit();
            return {
                name: updateAttr.name,
                avatar: updateAttr.avatar,
                status: this.constant.USER_STATUS.AUTHENTICATED,                            //授权
                user_role: role
            }
        }
        catch (error) {
            await this.rollback();
            throw error;
        }

    }





}

module.exports = UserService;
