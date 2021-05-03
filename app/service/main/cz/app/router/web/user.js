module.exports = app => {
    const { router, controller } = app;
    const webapi =  controller.web;
    const base_path = '/web/user';

    //登录 by code
    router.post(base_path + '/login',webapi.user.login);

    //登录 by skey
    router.post(base_path + '/loginBySkey',webapi.user.loginBySkey);
    //获取用户信息
    router.get(base_path ,webapi.user.getUserInfo);
    //绑定手机号
    router.patch(base_path + '/mobile',webapi.user.bindMobile);

    router.get(base_path + '/mobile',webapi.user.getUserMobile);

    router.patch(base_path,webapi.user.updateUserInfo);
    //用户操作记录
    router.post(base_path + '/op',webapi.user.createRecordUserOp);
    //获取积分排行榜列表
    router.get(base_path + '/bprank/list',webapi.userRank.getBonusPointsRankList);

    router.get(base_path + '/vdrank/list',webapi.userRank.getViewDurationRankList);
    //用户中心详情
    router.get(base_path + '/center',webapi.user.getUserCenterContent);
    //历史记录
    router.get(base_path + '/history',webapi.user.getViewHistoryRecord);

};
