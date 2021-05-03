
const path = require('path');

module.exports = (app)=>{
    const config = {};

    config.swagger = {
        swaggerDefinition: {
            info: {
                title: 'DEMO',
                version: '1.0.0',
                description: 'DEMO',
            },
            basePath: '/',
        },
        apis:[path.join(app.baseDir,'/app/controller/*.js')],
        swaggerPath: '/swagger.json'
    };
    return config;
};

