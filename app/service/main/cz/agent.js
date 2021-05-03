const WingmanClient = require('./ClusterClient/WingmanClient/WingmanClient'); // 上面那个模块
const ArticlePublishClient = require('./ClusterClient/AritlcePublishClient/ArtilcePublistCilent');
const TimerTaskClient = require('./ClusterClient/TimerTaskClient/ArtilcePublistCilent');


module.exports = agent => {
    const config = agent.config;
    agent.wingmanClient = new WingmanClient(
        Object.assign({}, config.WingmanClient, { cluster: agent.cluster })
    );
    //TODO agent中获取匿名ctx无法获取controller与service，只能获取model
    //TODO 注册agent对象，调用其中messenger与worker通信
    agent.articlePublishClient = new ArticlePublishClient(
        Object.assign({}, {agent: agent}, { cluster: agent.cluster })
    );

    agent.timerTaskClient = new TimerTaskClient(
        Object.assign({}, {agent: agent},{ cluster: agent.cluster })
    );


    agent.beforeStart(async () => {
        await agent.wingmanClient.ready();
        await agent.articlePublishClient.ready();
        await agent.timerTaskClient.ready();
    });
};
