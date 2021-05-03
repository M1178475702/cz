const XdWxApp = require('./app/common/app/XdWxApp');
const constant = require('./app/common/constant/xd-constant');
const error = require('./app/core/error/Error.js');
const AppManager = require('./app/common/app/AppManager');
const WingmanClient = require('./ClusterClient/WingmanClient/WingmanClient'); // 上面那个模块
const ArticlePublishClient = require('./ClusterClient/AritlcePublishClient/ArtilcePublistCilent');
const TimerTaskClient = require('./ClusterClient/TimerTaskClient/ArtilcePublistCilent');

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    configWillLoad() {
        this.app.constant = constant;
        this.app.error = error;
    }

    async willReady() {
        //设置sequelize错误
        this.app.error.SequelizeBaseError = this.app.model.Error;

        //初始化 wingmanClient(僚机)
        const config = this.app.config;
        this.app.wingmanClient = new WingmanClient(
            Object.assign({}, config.WingmanClient, {cluster: this.app.cluster})
        );
        await this.app.wingmanClient.ready();
        this.app.articlePublishClient = new ArticlePublishClient(
            Object.assign({}, {cluster: this.app.cluster})
        );
        await this.app.articlePublishClient.ready();
        this.app.timerTaskClient = new TimerTaskClient(
            Object.assign({}, {cluster: this.app.cluster})
        );
        await this.app.timerTaskClient.ready();

        //处理定时任务
        this.app.messenger.on('TIMER_TASK', async (task) => {
            /*
            * {
            *   service:[],
            *   method: '',
            *   args: []
            * }
            *
            * */
            const ctx = this.app.createAnonymousContext();
            ctx.beInternal();
            let service = ctx.service;
            for (const service_name of task.service)
                service = service[service_name];
            await service[task.method](...task.args);
        });

        //监听文章延时发布事件
        this.app.messenger.on('article_delayed_publish', async (articleId) => {
            const ctx = this.app.createAnonymousContext();
            ctx.beInternal();
            await ctx.service.article.back.edit.publish(articleId);
        });

        //初始化wxapp
        const wxapps = await this.app.model.XdXdApp.findAll({
            where: {app_id: 11},
            attributes: [['app_id', 'appId'], ['app_wx_secret', 'appWxSecret'], ['app_wx_id', 'appWxId'], ['app_wx_url', 'appWxUrl'], ['app_name', 'appName']],
            raw: true
        });
        if (!wxapps.length) throw new this.app.error.InvalidError('no available app');
        this.app.wxapps = new AppManager(this.app);
        for (let wxappopt of wxapps) {
            await this.app.wxapps.setApp(new XdWxApp(this.app, wxappopt));
        }

        //添加验证rule
        //先convert，后rule
        this.app.validator.addRule('anyDate',
            (rule, val) => {
                if (val === 'Invalid Date' || val.toString() === 'Invalid Date')
                    return val;
            },
            false,
            (val) => {
                if (val === "")
                    return new Date();
                if (Number.isFinite(val) || /^[0-9]*[.]?[0-9]*$/.test(val))
                    return 'Invalid Date';
                return new Date(val);
            }
        );
        this.app.validator.addRule('mobile', (rule, val) => {
            if (!/^1[3456789]\d{9}$/.test(val))
                return val;
        });

    }
}

module.exports = AppBootHook;
