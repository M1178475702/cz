const xdutil = require('../helper/xd-util');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fsPromises = fs.promises;


module.exports = (options) => {
    const defaultOpt = {
        destination: (ctx, fileStream) => {
            return os.tmpdir()              //默认存放在tmp文件夹
        },
        filename: (ctx, fileStream) => {
            return fileStream.filename
        }
    };
    const getDestination = options.destination || defaultOpt.destination;
    const getFilename = options.filename || defaultOpt.filename;

    return async (ctx, next) => {

        if (!ctx.is('multipart')){
            ctx.result.retcode = ctx.app.constant.API_RESULT_STATUS.DATA_ERROR;
            ctx.success('The mime should be form-data!');
            return;
        }
        const files = {}, uploadFiles = [];
        try {
            ctx.request.body = {};
            await handlePart();
            ctx.request.files = files;
        }
        catch (error) {
            await abortError();
            ctx.result.msg.error = error.message;
            ctx.result.retcode = ctx.app.constant.API_RESULT_STATUS.SERVER_ERROR;
            ctx.success('上传文件出错');
            return;
        }

        async function handlePart() {
            const parts = ctx.multipart({autoFields: false});
            //流（part）必须被即使消费掉，否则会堵塞;
            let part;
            do {
                part = await parts();
                if (!part) break;
                if (part.length) {   //为field
                    ctx.request.body[part[0]] = part[1];
                    continue;
                }
                //为文件
                part.now = new Date();
                await appendFile(part);
            } while (part != null);
        }

        async function appendFile(part) {
            const filename = getFilename(ctx, part);
            const fileDir = getDestination(ctx, part);
            const filepath = path.join(fileDir,filename);
            await xdutil.writeFileByStream(filepath ,part,true);

            const meta = {
                field: part.fieldname,
                originalFilename: part.filename,
                filename: filename,
                fileDir: fileDir,
                filepath: filepath,
                mime: part.mime,
                now:part.now
            };
            uploadFiles.push(meta);
            if (!files[part.fieldname])
                files[part.fieldname] = [];
            files[part.fieldname].push(meta);
        }

        async function abortError() {
            for (let file of uploadFiles) {
                await fsPromises.unlink(file.fileDir + file.filename)
            }
        }
        return next();
    }
};



