'use strict';
const path = require('path');
// had enabled by egg
// exports.static = true;

exports.cluster = {
    enable: true,
    package: 'egg-cluster'
};

exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};

exports.httpProxy = {
    enable: true,
    package: 'egg-http-proxy',
};

exports.validate = {
    enable: true,
    package: 'egg-validate'
};

exports.session = true;

// exports.swagger = {
//     enable: true,
//     path: path.join(__dirname, '../plugin/egg-swagger-jsdoc')
// };
exports.multipart = true;

exports.logview = {
    package: 'egg-logview',
    // env: ['local', 'default', 'test', 'unittest']
};

exports.knex = {
    enable: true,
    package: 'egg-knex',
};

exports.redpack = {
    enable: false,
    path: path.join(__dirname, '../plugin/egg-wxredpack')
};


// exports.cache = {
//     enable: true,
//     package:'egg-cache',
// };



//egg-sequelize-auto -o "./app/model/" -d xd_test -h 47.98.146.46 -u xd -x xd#123456 -p 33061 -C camel -t xd_acm_user
//
