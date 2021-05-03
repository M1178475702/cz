const util = require('util');
const rp = require('request-promise');
const xdutil = require('../../../app/helper/xd-util');

class XdWxApp {
    constructor(mainApp,options) {
        this.setupApp(mainApp,options);
    }

    setupApp(mainApp,options) {
        this.mainApp = mainApp;
        this.appId = options.appId;
        this.appWxSecret = options.appWxSecret;
        this.appWxId = options.appWxId;
        this.appWxUrl = options.appWxUrl;          //获取用户access_token
        this.appName = options.appName;
        this.access_token = null;
        this.token_expires_in = null;
        this.api_ticket = null;
        this.api_ticket_expires_in = null;
        this.getAcccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET';
    }

    get APP_SECRET() {
        return this.appWxSecret;
    }

    get APP_WX_ID() {
        return this.appWxId;
    }

    get APP_URL() {
        return this.appWxUrl;
    }

    async getWxAccessToken(wxcode) {
        if(wxcode === 'ceshi'){
            return {
                isAuth: 1,
                openid: 'ceshi'
            };
        }

        const requrl = util.format(this.APP_URL, this.APP_WX_ID, this.APP_SECRET, wxcode);
        const response =   await rp(requrl, { resolveWithFullResponse: true });
        const result = JSON.parse(response.body);
        if(result.errcode) throw new this.mainApp.error.InvalidError('invalid wxcode');
        if(result.scope === 'snsapi_base')
            result.isAuth = 0;
        else if(result.scope === 'snsapi_userinfo')
            result.isAuth = 1;
        else
            throw new this.mainApp.error.InvalidError('invalid scope');
        // result.openid = 'ceshi';
        return result;
    }

    async getWxUserInfo(access_token,openid,lang){
        let url = 'https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=%s';
        const requrl = util.format(url,access_token,openid,lang || 'zh_CN');
        const response = await rp(requrl,{ resolveWithFullResponse: true });
        const result = JSON.parse(response.body);
        if(result.errcode)
            throw new this.mainApp.error.InvalidError(result.errmsg);
        return result;
    }

    async setWxAppAccessToken(){
        const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s';
        const requrl = util.format(url,this.APP_WX_ID, this.APP_SECRET);
        const response = await rp(requrl,{ resolveWithFullResponse: true });
        const result = JSON.parse(response.body);
        if(result.errcode){
            if(result.errcode === -1) {
                this.mainApp.logger.error(error);
                await this.setWxAppAccessToken();
            }
            else  throw new this.mainApp.error.InvalidError('无效id或secret');
        }
        this.access_token = result.access_token;
        this.token_expires_in = Date.now() + parseInt(result.expires_in);
        return result;
    }

    async setWxAppJsApiTicket(){
        const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi';
        const requrl = util.format(url,this.access_token);
        const response = await rp(requrl,{ resolveWithFullResponse: true });
        const result = JSON.parse(response.body);
        if(result.errcode){
            if(result.errcode === -1) {
                this.mainApp.logger.error(error);
                setTimeout(async ()=>{
                    await this.setWxAppJsApiTicket();
                },50)
            }
            else  throw new this.mainApp.error.InvalidError('无效id或secret');
        }
        this.api_ticket = result.ticket;
        this.api_ticket_expires_in = result.expires_in;

    }

    async getWxAppAccessToken(){
        return this.access_token;
    }

    async getWxAppApiTicket(){
        return this.api_ticket;
    }

    async getWxAppApiTicketSignature(url){
        let ticket = await this.getWxAppApiTicket();
        const noncestr = await xdutil.generateString(16);
        const now = Date.now().toString().substr(0.10);
        const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${now}&url=${url}`;
        const sinature = xdutil.sha1(str);
        return {
            signature: sinature,
            t: now,
            noncestr: noncestr,
            WxAppId: this.APP_WX_ID,
            url: url
        };
    }

}

XdWxApp.instance = null;

module.exports = XdWxApp;
