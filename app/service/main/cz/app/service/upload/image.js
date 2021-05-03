const Service = require('../../core/service/ApiService');
const path = require('path');
const fsPromises = require('fs').promises;
const xdutil = require('../../helper/xd-util');
const sharp = require('sharp');
const {URL} = require('url');
const whitelist = [
    // images
    '.jpg', '.jpeg', // image/jpeg
    '.png', // image/png, image/x-png
    '.gif', // image/gif
    '.bmp', // image/bmp
    '.wbmp', // image/vnd.wap.wbmp
    '.webp',
    '.psd',
];

class UploadService extends Service {
    async singleImage(imageInfo) {
        try {
            imageInfo.relative_path = /[\/\\]image[\/\\].+/.exec(imageInfo.filepath)[0];
            //是gif图直接跳过
            if (!/gif/.test(imageInfo.mime)) {
                let imageSharp;
                //读取文件信息
                let {size} = await fsPromises.stat(imageInfo.filepath);
                //如果是webp，则转化成jpg,初始化imageSharp
                if (/webp/.test(imageInfo.mime)) {
                    imageSharp = await sharp(imageInfo.filepath).jpeg();
                } else if (size > this.constant.IMAGE_MAX_SIZE) {
                    imageSharp = await sharp(imageInfo.filepath);
                }
                //判断是否压缩
                if (size > this.constant.IMAGE_MAX_SIZE) {
                    const meta = await imageSharp.metadata();
                    meta.size = size;
                    this.compress(meta, imageSharp);
                }

                if (imageSharp) {
                    const oldPath = imageInfo.filepath;
                    imageInfo.filepath = path.join(imageInfo.fileDir, this.ctx.helper.uuid() + path.extname(oldPath));
                    imageInfo.relative_path = /[\/\\]image[\/\\].+/.exec(imageInfo.filepath)[0];
                    await this.ctx.helper.writeFileByStream(imageInfo.filepath, imageSharp, true);
                    await this.ctx.helper.unlink(oldPath);
                }
                /*当文件存在时，sharp的readStream无法直接覆盖文件，会报错：Input file contains unsupported image format’
                /*切删除文件由于缓冲的问题，无法立即删除（或者是因为有readStream在占用文件的原因？）
                /*可能的原因是：readStream并没有占用文件，只是打开（读）文件，所以可以对文件进行修改
                /*由于这个原因，删除文件时并没有立即删除？只是删除了文件数据。
                /*然后当使用readStream读取文件时，文件数据已经被清空，无法识别文件类型（但是只是文件存在也依然报同样的错）
                /*目前方案是，先另新生成一个文件，再讲原来文件删除*/

            }
            await this.model.XdXdImage.create({
                image_name: imageInfo.filename,
                image_url: imageInfo.relative_path,
                create_time: imageInfo.now
            });
            return this.getImageUrl(imageInfo.relative_path);
        }
        catch (error) {
            throw error;
        }
    }

    //当函数中代码有错误时（如引用了不存在的变量），参数传参会失效（undefined）
    async internetImage(reqUrl) {
        try {
            const reqOpt = {
                method: 'GET',
                encoding: null,
                headers: {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'}
            };
            const noProtocolReg = /^\/\//;
            //若不存在协议，则尝试加上https协议头
            if (noProtocolReg.test(reqUrl)) {
                reqUrl = 'https:' + reqUrl;
            }
            try {
                reqUrl = new URL(reqUrl).toString();
            }
            catch (error) {
                throw new this.error.InvalidError('无效URL！');
            }

            //针对简书的图片URL处理
            if (/upload-images.jianshu.io/.test(reqUrl))
                reqUrl = reqUrl.replace(/\?.+/, '');
            //请求
            const response = await this.app.curl(reqUrl, reqOpt);
            if (response.status !== 200) {
                throw new this.error.NetworkError('下载图片失败');
            }
            let imageType = response.headers['content-type'].replace(/image\//, '.') || path.extname(reqUrl) || '';
            // const size = response.headers['content-length'] || response.data.byteLength;          //获取文件的大小
            if (whitelist.indexOf(imageType) === -1)
                throw new this.error.InvalidError('不允许的上传类型！');

            const now = new Date();
            const filename = xdutil.uuid('xuedao.com') + imageType;
            const urlPrefix = `image/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/`;
            const relativeUrl = `${urlPrefix}${filename}`;
            const fileDictionary = path.join(this.app.baseDir, '/app/public/upload/', urlPrefix);
            const filepath = path.join(fileDictionary, filename);

            //gif图不做处理，直接保存
            if (imageType === '.gif') {
                await this.ctx.helper.writeFile(filepath, response.data, true);
            } else {
                let sharpSteam;
                if (imageType === '.webp')
                    sharpSteam = sharp(response.data).jpeg();
                else
                    sharpSteam = sharp(response.data);
                const meta = await sharpSteam.metadata();

                //仅大于200kb时才压缩
                if (meta.size > this.constant.IMAGE_MAX_SIZE) {
                    this.compress(meta, sharpSteam);
                }
                await this.ctx.helper.writeFileByStream(filepath, sharpSteam, true);
            }
            await this.model.XdXdImage.create({
                image_name: filename,
                image_url: relativeUrl,
                create_time: now
            });
            return this.getImageUrl(relativeUrl);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    /*
    * 先判断size，是否需要压缩
    * 如果不需要，data可以直接写保存
    * 如果需要，则可先转化为sharp流
    * 然后输入compress
    * 输出一定是流
    * */
    compress(meta, sharpStream) {
        let width = meta.width;
        let height = meta.height;
        if (meta.width > this.constant.IMAGE_MAX_WIDTH) {
            width = this.constant.IMAGE_MAX_WIDTH;
            height = Math.ceil(meta.height * (this.constant.IMAGE_MAX_WIDTH / meta.width));
            sharpStream.resize(width, height);
        }
        else{
            height  = Math.ceil(height * (this.constant.IMAGE_MAX_SIZE / meta.size));
            width  = Math.ceil(width * (this.constant.IMAGE_MAX_SIZE / meta.size));
            sharpStream.resize(width, height);
        }
    }

    getImageUrl(relative_path){
        const {upload} = this.ctx.app.config;
        const path =  `${upload.host}${upload.static_prefix}${upload.upload_dir}${relative_path}`;
        return path.replace(/\\/g,'/')
    }


}

module.exports = UploadService;
