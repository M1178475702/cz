const xdutil = require('../../helper/xd-util');
const path = require('path');
module.exports = app => {
    const { router, controller } = app;
    const upload =  controller.upload;
    const base_path = '/upload';
    const { multipart } = app.middleware;

    const singleImageOpt = {
        destination:(ctx,fileStream)=>{
            if(ctx.request.body.now)
                fileStream.now = ctx.request.body.now;
            const now = fileStream.now;
            const relative_dir = `/image/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
            return path.join(app.baseDir,'/app',app.config.upload.static_prefix
                ,app.config.upload.upload_dir,relative_dir) ;
        },
        filename: (ctx,fileStream)=>{
            let filename;
            if(ctx.request.body && ctx.request.body.filename)
                filename = ctx.request.body.filename + path.extname(fileStream.filename);
            else
                filename = xdutil.uuid('xuedao.com') + path.extname(fileStream.filename);
            return filename;
        }
    };
    router.post(base_path + '/singleImage',multipart(singleImageOpt),upload.image.singleImage);

    router.post(base_path + '/internetImage',upload.image.internetImage);
};
