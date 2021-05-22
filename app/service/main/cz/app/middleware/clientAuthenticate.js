module.exports = () => {
    return async function clientAuthenticate(ctx, next) {

        const ignorePath = ['/web/user/login', '/web/user/loginBySkey'];
        ctx.session.userId = 10006;
        await next();
        ctx.session.userId = 10006;
        // if (isIgnore(ctx.path, ignorePath) || ctx.session.userId && ctx.session.status >= 1)
        //     return next();
        // else {
        //     //为未认证api
        //     //错误response
        //     ctx.handleError(new ctx.app.error.PermissionError('用户未登录或凭证已过期'));
        // }
    };
};

function isIgnore(path, ignorePath) {
    for (let ig of ignorePath) {
        if (path === ig)
            return true;
    }
    return false;
}
