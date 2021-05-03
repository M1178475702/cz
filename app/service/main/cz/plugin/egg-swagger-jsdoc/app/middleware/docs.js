const fsPromises = require('fs').promises;
const path = require('path');
module.exports = options => {
    const reg = /^\/docs\//;
    const contentType = {
        '.css': 'text/css; charset=UTF-8',
        '.js': 'application/javascript; charset=UTF-8',
        '.png': 'image/png'
    };
    return async (ctx, next) => {
        if (reg.test(ctx.path)) {
            const filepath = ctx.path.replace(reg, '');
            if (filepath === '' || filepath === '/') {
                const docs = await fsPromises.readFile(path.join(__dirname, '../../docs/index.html'));
                ctx.set('content-type', 'text/html; charset=UTF-8');
                ctx.body = docs;
            } else {
                ctx.set('content-type', contentType[path.extname(filepath)]);
                ctx.body = await fsPromises.readFile(path.join(__dirname, `../../docs/${filepath}`));
            }
        }
        else
            return next();
    }
};
