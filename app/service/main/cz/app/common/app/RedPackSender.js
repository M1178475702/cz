const crypto = require('crypto');
const rp = require('request-promise');
const convert = require('xml-js');

class RedPackSender {

    constructor(options) {
        this.mch_id = options.mch_id;                  //商户号
        this.wxappid = options.wxappid;                //微信appid
        this.send_name = options.send_name;            //商户名称
        this.client_ip = options.client_ip;
        this.api_red_pack_url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack';

    }

    async sendCommonRedPack(re_openid, mch_billno, total_amount, total_num, act_name, remark, wishing) {
        const nonstr = this.generateRandomString(16);
        const options = {
            nonstr: nonstr,
            mch_id: this.mch_id,
            wxappid: this.wxappid,
            send_name: this.send_name,
            re_openid: re_openid,
            mch_billno: mch_billno,
            total_amount: total_amount,
            total_num: total_num,
            act_name: act_name,
            remark: remark,
            wishing: wishing
        };
        const response_data = await this._sendRedPack(options);
    }

    async _sendRedPack(options) {
        const url_param = this.createUrlParam(options);
        options.sign = this.createSign(url_param);
        const xml_data = this.json2Xml(options);
        const response = await rp({
            uri: this.api_red_pack_url,
            method: 'POST',
            body: xml_data,
            resolveWithFullResponse: true
        });


        const response_data = convert.xml2js(response.data);
        //处理 response_data
        return response_data;
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
        return _arr.join('&');
    }

    json2Xml(json) {
        let _xml = '';
        for (let key in json) {
            _xml += '<' + key + '>' + json[key] + '</' + key + '>';
        }
        return '<xml>' + _xml + '</xml>';
    }

    createSign(data) {
        return crypto.createHash('md5').update(data, 'utf8').digest('hex').toUpperCase();
        //md5
    }
}

module.exports = RedPackSender;
