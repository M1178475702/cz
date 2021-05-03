module.exports = () => {
    return async function CORS(ctx, next) {

        ctx.set('Access-Control-Allow-Origin', `${ctx.get('origin')}`);
        //TODO 允许携带cookie
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Token ,X-Requested-With ');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
        ctx.set('Content-Type', 'application/json;charset=UTF-8');
        if (ctx.method === 'OPTIONS')
            ctx.status = 200;
        else
            return next();
    }
};
