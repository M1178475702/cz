const crypto = require('crypto');
const fs = require('fs');
const uv4 = require('uuid/v4');
const fsPromises = fs.promises;
const path = require('path');
const moment = require('moment');
const util = require('util');
const stringWidth = require('string-width');
// const lodash = require('lodash');
const _ = require('underscore');
const binary_search = require('./binary_search');
const Promises = require('./promises');
const base18 = require('./base18');
const random = require('./random');

exports.random = random;

exports.base18 = base18;

exports.concat = concat;

exports.getPromises = Promises.getPromises;

exports.binary_search = binary_search;

exports.stringWidth = stringWidth;
/**
 * @description 产生指定长度的随机16进制字符串
 * @param size  指定字符串长度
 * @returns Promise<any> random
 */

exports.generateString = (size) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(size / 2, (err, buf) => {
            if (err) {
                reject(err);
            } else {
                resolve(buf.toString('hex'));
            }
        })
    })
};

exports.remove = remove;

exports.md5 = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
};

exports.sha1 = (data) => {
    return crypto.createHash('sha1').update(data).digest('hex');
};

exports.hash = (algorithm, data, encoding) => {
    encoding = encoding || 'hex';
    return crypto.createHash(algorithm).update(data).digest(encoding);
};

exports.farawayDays = farawayDays;

exports.weekday = weekday;

exports.moment = moment;


exports.uuid = (name) => {
    return uv4(name || 'xuedao.com').replace(/-/g, '');
};

exports.writeFileByStream = async (filepath, readStream, isMakeDir, options) => {
    try {
        await _writeFileByStream(filepath, readStream, options)
    }
    catch (error) {
        if (error.code === 'ENOENT' && isMakeDir === true) {
            await fsPromises.mkdir(path.dirname(filepath), {recursive: true});
            await _writeFileByStream(filepath, readStream, options)
        } else
            throw error;
    }
};

exports.writeFile = writeFile;

exports.unlink = unlink;

exports.LCS = LCS;

exports.fp = fsPromises;

exports.isObject = (obj, allowEmpty) => {
    if (obj === null)
        return false;
    if (typeof obj === 'object') {
        if (allowEmpty)
            return true;
        else {
            const keys = Object.keys(obj);
            return keys.length !== 0;
        }
    }
};

exports.util = util;

exports._ = _;

exports.getYMDhms = getYMDhms;


function getYMDhms(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

/**
 *
 * @param distance    //距离今天的天数  默认0
 * @param hour        //所求当天几点    默认0
 * @param minute      //几分            默认0
 * @param second      //几秒            默认0
 * @param cur
 * @param useUTC
 * @returns {Date}
 */

function farawayDays(distance = 0, hour = 0, minute = 0, second = 0, cur = new Date(), useUTC = false) {
    let time = new Date(cur.getTime() + distance * 86400000);
    time = new Date(`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${hour}: ${minute}:${second}`);
    if (useUTC)
        time.setTime(time.getTime() + 28800000);
    return time;
}

function weekday(weeks, day, h, m, s) {
    let nowDay = new Date().getDay() || 7;
    let distance = weeks * 7 + (day - nowDay);
    return farawayDays(distance, h, m, s);
}

async function writeFile(filepath, data, isMakeDir, options) {
    try {
        await fsPromises.writeFile(filepath, data, options);
    }
    catch (error) {
        if (error.code === 'ENOENT' && isMakeDir === true) {
            await fsPromises.mkdir(path.dirname(filepath), {recursive: true});
            await fsPromises.writeFile(filepath, data, options);
        } else
            throw error;
    }
}

function _writeFileByStream(filepath, readStream, options) {
    return new Promise((resolve, reject) => {
        const wstream = fs.createWriteStream(filepath, options);
        readStream.pipe(wstream);
        wstream.on('close', function () {
            resolve(wstream.path);
        });
        wstream.on('error', async (error) => {
            reject(error);
        });
        readStream.on('error', async (error) => {
            reject(error);
        })
    });
}


async function unlink(filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

function LCS(str1, str2) {
    const dp = [];
    //维护列长数组,行数为2行，旧的一行，当前（以及新）的一行
    for (let i = 0; i <= 2; ++i) {
        let temp = [];
        for (let j = 0; j <= str2.length; ++j) {
            temp.push(0);
        }
        dp.push(temp);
    }
    let cur = 2;
    let last = 1;
    for (let i = 1; i <= str1.length; i++) {
        let temp = cur;
        cur = last;
        last = temp;
        for (let j = 1; j <= str2.length; j++) {
            if (str1[i - 1] === str2[j - 1])//判断A的第i个字符和B的第j个字符是否相同
                dp[cur][j] = dp[last][j - 1] + 1;
            else
                dp[cur][j] = dp[last][j] >= dp[cur][j - 1] ? dp[last][j] : dp[cur][j - 1];
        }
    }
    return dp[cur][str2.length];//最终的返回结果就是dp[n][m]
}

/***
 * @description 异步删除元素
 * @param array
 * @param isDelete async function
 * @returns {Promise<void>}
 */
async function remove(array, isDelete) {
    if (typeof isDelete !== 'function')
        throw TypeError('isDelete must be function');

    const promises = array.map(async (ele, index) => {
        if (await isDelete(ele)) {
            array.splice(index, 1);
        }
    });
    await Promise.all(promises);
}

async function concat(left, right, length = right.length) {
    for(let i = 0;i < length; ++i){
        left.push(right[i]);
    }
    return left;
}

