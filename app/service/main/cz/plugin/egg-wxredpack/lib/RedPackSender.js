const crypto = require('crypto');
const rp = require('request-promise');
const convert = require('xml-js');
const WxRedEnvelop = require('./interface');
const fp = require('fs').promises;
const path = require('path');
const redpackUtils = require('./utils') ;
const sdk_base = require('sdk-base');
class RedPackSender extends sdk_base {

    constructor(options) {
        super({
            initMethod: 'init'
        });
        this.mch_id = options.mch_id;                  //商户号
        this.wxappid = options.wxappid;                //微信appid
        this.send_name = options.send_name;            //商户名称
        this.client_ip = options.client_ip;
        this.key = options.key;
        this.api_common_red_pack_url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack';
        this.api_query_red_pack_url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo';
    }

    async init(){
        this.agentOptions = {
            cert: (await fp.readFile(path.join(__dirname, './apiclient_cert.pem'))).toString(),
            key: (await fp.readFile(path.join(__dirname, './apiclient_key.pem'))).toString()
        }
    }

    async sendCommonRedPack(re_openid, mch_billno, total_amount, total_num, act_name, remark, wishing, send_name) {
        const nonstr = await this.generateRandomString(16);
        const options = {
            act_name: act_name,
            client_ip: this.client_ip,
            mch_billno: mch_billno,
            mch_id: this.mch_id,
            nonce_str: nonstr,
            re_openid: re_openid,
            remark: remark,
            send_name: send_name,
            total_amount: total_amount,
            total_num: total_num,
            wishing: wishing,
            wxappid: this.wxappid,
        };
        return this._sendRedPack(options);
    }

    async _sendRedPack(options) {
        const url_param = this.createUrlParam(options);
        options.sign = this.createSign(url_param);
        const xml_data = this.json2Xml(options);

        const response = await rp({
            uri: this.api_common_red_pack_url,
            method: 'POST',
            body: xml_data,
            resolveWithFullResponse: true,
            agentOptions: this.agentOptions
        });

        //是否在插件层，处理错误？比如，是否可重发，是否不可恢复错误，是否向上级报错，是否等待，是否轮询
        return this.xml2json(response.body);
    }

    async queryRedPackRecord(mch_billno){
        const nonstr = await this.generateRandomString(16);
        const options = {
            appid: this.wxappid,
            bill_type: 'MCHT',
            mch_billno: mch_billno,
            mch_id: this.mch_id,
            nonce_str: nonstr,
        };

        return this._queryRedPackRecord(options);
    }

    async _queryRedPackRecord(options){
        const url_param = this.createUrlParam(options);
        options.sign = this.createSign(url_param);
        const xml_data = this.json2Xml(options);

        const response = await rp({
            uri: this.api_query_red_pack_url,
            method: 'POST',
            body: xml_data,
            resolveWithFullResponse: true,
            agentOptions: this.agentOptions
        });

        return this.xml2json(response.body);
    }

    generateRandomString(size) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(size / 2, (err, buf) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf.toString('hex'));
                }
            })
        })
    }

    createUrlParam(options) {
        let _arr = [];
        for (let key in options) {
            _arr.push(key + '=' + options[key]);
        }
        _arr.push('key='+ this.key);
        return _arr.join('&');
    }

    createSign(data) {
        return crypto.createHash('md5').update(data, 'utf8').digest('hex').toUpperCase();
        //md5
    }

    json2Xml(json) {
        let _xml = '';
        for (let key in json) {
            _xml += '<' + key + '>' + json[key] + '</' + key + '>';
        }
        return '<xml>' + _xml + '</xml>';
    }

    xml2json(response_body){
        const response_data = convert.xml2js(response_body);
        const data_list = response_data['elements'][0]['elements'];
        const result = {};
        for(const element of data_list){
            result[element.name] = element.elements[0][element.elements[0].type]
        }
        return result;
    }


}

module.exports = RedPackSender;
