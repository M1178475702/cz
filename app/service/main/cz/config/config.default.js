'use strict';
const path = require('path');
const constant = require('../app/common/constant/xd-constant');


module.exports = appInfo => {
    const config = {};

    config.rpc = {
        collectionClient: {
            name: "cz-collection",
            addr: "cz-collection:9000"
        }
    }

    config.middleware = ['cors', 'clientAuthenticate', 'backAuthenticate'];

    config.cluster = {
        listen: {
            port: 8000,
        }
    };

    config.upload = {
        // host: 'http://api.hzxuedao.com',
        host: 'http://www.dmt2017.xyz:8000',
        // host: 'http://localhost:6001',
        static_prefix: '/public',
        upload_dir: '/upload'
    };

    config.session = {
        key: 'xd_sid',
        maxAge: 1000 * 3600 * 24, // 1 天
        encrypt: true,
        // encode: (body) => {return JSON.stringify(body)},
        // decode: (string) => {return JSON.parse(string)},
        renew: true
    };

    const dbConfig = {
        dialect: 'mysql',
        database: 'xd_test',
        username: 'xd',
        password: 'xd#123456',
        host: '47.98.146.46',
        port: '33061',
        pool: {
            max: 20,
            idle: 300000,
            acquire: 600000
        },
        define: {
            timestamps: false
        },
        timezone: '+08:00',
    };

    config.WingmanClient = {
        exec: path.join(appInfo.baseDir, './ClusterClient/WingmanClient/task_process'),
        count: 1,
        maxQueueSize: 80
    };

    config.bodyParser = {
        jsonLimit: '50mb'
    };

    exports.logview = {};

    config.redPack = {
        mch_id: '1545833341',                  //商户号
        wxappid: 'wxfc468f2617f9238d',                //微信appid
        // send_name: 'TEST',            //商户名称
        client_ip: '47.98.146.46',
        key: 'hangzhouxuedaojiaoyukeji01234567'
    };

    // exports.cache = {
    //     default: 'memory',
    //     stores: {
    //         memory: {
    //             driver: 'memory',
    //             max: 100,
    //             ttl: 0,
    //         },
    //     },
    // };


    config.validate = {
        convert: true,
        validateRoot: false,
    };


    config.clientAuthenticate = {
        match: (ctx) => {
            const reg = /web|wx/i;
            if(/\/acm|\/internal|\/web\/wxapp/.test(ctx.path))
                return false;
            else
                return reg.test(ctx.path);
        }
    };
    config.backAuthenticate = {
        match: (ctx) => {
            const reg = /back/i;
            return reg.test(ctx.path);
        }
    };

    // config.wxapp = {
    //     appId: 10   //测试app
    // };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1526343653947_0101';


    config.logger = {
        appLogName: `${appInfo.name}-web.log`,
        coreLogName: 'egg-web.log',
        agentLogName: 'egg-agent.log',
        errorLogName: 'common-error.log',
    };
    config.security = {
        csrf: false,
    };

    config.knex = {
        // database configuration
        client: {
            // database dialect
            dialect: dbConfig.dialect,
            connection: {
                // host
                host: dbConfig.host,
                // port
                port: dbConfig.port,
                // username
                user: dbConfig.username,
                // password
                password: dbConfig.password,
                // database
                database: dbConfig.database,
                requestTimeout: 600000,
            },
            // connection pool
            pool: {min: 0, max: 1},
            // acquire connection timeout, millisecond
            acquireConnectionTimeout: 600000,
        },
        // load into app, default is open
        app: true,
        // load into agent, default is close
        agent: false,
    };

    config.sequelize = dbConfig;

    config.view = {
        //配置多个 view 目录
        root: [
            path.join(appInfo.baseDir, 'app/view'),
            path.join(appInfo.baseDir, 'app/public'),
        ].join(','),
        defaultViewEngine: 'ejs',
        defaultExtension: '.html',
        mapping: {
            '.ejs': 'ejs',
        },
    };

    config.appBaseDir = path.join(appInfo.baseDir, 'app');

    //上传文件类型
    config.multipart = {
        fileSize: '100mb',
        fileExtensions: ['.xls', '.xlsx', '.pdf'],
    };

    config.static = {
        prefix: constant.STATIC_PREFIX,
        dir: path.join(appInfo.baseDir, 'app/public'),
        maxAge: 3153600,
        buffer: true
    };
    config.development = {
        overrideDefault: true,
        watchDirs: [
            'app/controller',
            'app/service',
            'app/middleware',
            'app/model',
            'app/router',
            'app/view',
        ]
    };

    config.swagger = {
        swaggerPath: '/swagger.json',
        swaggerDefinition: {
            swagger: "2.0",
            info: {
                swagger: "2.0",
                title: '学到API文档',
                version: '1.0.0',
                description: '学到API文档\n\r' +
                    '每个API的返回结果的格式为：\n\r  ' +
                    '{' +
                    '   data:{},' +
                    '   msg:{' +
                    '     error:"",' +
                    '     prompt:""' +
                    '   },' +
                    '   retcode: 1' +
                    '}\n\r  ' +
                    'note:\n\r  ' +
                    '  retcode的可能值：1 成功 -1参数错误 -401未认证（未登录） -403未授权（权限不足）-500服务器错误\n\r  ' +
                    '  prompt为向用户返回的操作提示信息\n\r  ' +
                    '  error仅在调试期使用，返回内部错误信息\n\r  '
            },
            basePath: '/'
        },
        apis: [path.join(appInfo.baseDir, '/app/controller/*/*.js')]
    };

    return config;
};
