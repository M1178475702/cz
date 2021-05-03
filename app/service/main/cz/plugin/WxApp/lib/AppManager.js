const XdWxApp = require('./XdWxApp');

class WxAppManager {
    constructor(mainApp){
        this.wxapps = {};
        this.mainApp = mainApp;
    }
    async setApp(appInfo){
        if(!appInfo.appId){
            throw new ReferenceError('appName is undefined');
        }
        this.wxapps[appInfo.appId] = new XdWxApp(this.mainApp,appInfo);
        // await this.wxapps[appInfo.appId].setWxAppAccessToken();
        // await this.wxapps[appInfo.appId].setWxAppJsApiTicket();
    }

    getApp(appId){
        const app = this.wxapps[appId];
        if(!app){
            throw new ReferenceError('invalid app id');
        }
        return app;
    }
}

module.exports = WxAppManager;
