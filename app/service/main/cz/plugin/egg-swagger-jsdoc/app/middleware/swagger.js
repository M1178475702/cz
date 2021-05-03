const swaggerJSDoc = require('swagger-jsdoc');
// initialize swagger-jsdoc

module.exports = options => {
    const swagger = swaggerJSDoc(options);
    const reg = new RegExp(`\^${options.swaggerPath}`);
    return async (ctx,next)=>{
        if(reg.test(ctx.path)){
            ctx.body = swagger;
        }
        else
            return next();
    }
};
