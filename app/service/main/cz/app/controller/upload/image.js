const Controller = require('../../core/controller/ApiController');

class UploadImageController extends Controller{
    async singleImage(){
        const {ctx,service} = this;
        try{
            this.validate({image:'array'},ctx.request.files);
            this.result.data.imageUrl = await service.upload.image.singleImage(ctx.request.files['image'][0]);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }

    async internetImage(){
        const {ctx,service} = this;
        try{
            const body = ctx.request.body;
            this.validate({url:'string'},body);
            const url = body.url;
            this.result.data.imageUrl = await service.upload.image.internetImage(url);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }
}
module.exports = UploadImageController;
