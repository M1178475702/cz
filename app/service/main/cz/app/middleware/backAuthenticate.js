module.exports = () => {
    return async function backAuthorize(ctx, next) {
        const ignorePath = ['/back/admin/login'];
        if(isIgnore(ctx.path,ignorePath) || ctx.session && ctx.session.adminId)
          return next();
        else{
            ctx.body = {
                data: {},
                msg: {
                    error: '',
                    prompt: '未登录或凭证已过期',
                },
                retcode: -1,
            };
        }
    };
};

function isIgnore(path,ignorePath) {
    for(let ig of ignorePath){
        if(path === ig)
            return true;
    }
    return false;
}

