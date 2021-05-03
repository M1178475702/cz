
const xdutil = require('../../app/helper/xd-util');

module.exports = xdutil;


module.exports.block = (seconds)=>{
    const now = Date.now();
    seconds = 1000 * seconds;
    while (Date.now() - now < seconds){}
    return seconds;
};
