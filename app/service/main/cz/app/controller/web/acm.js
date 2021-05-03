const Controller = require('../../core/controller/ApiController');

class CommentController extends Controller {
    async createAcmUser(){
        try{
            const rule = {
                name: 'string',
                sex: 'int',
                user_number: 'string',
                birth_date: {type: 'anyDate'},
                academy: 'string',
                class_room: 'string',
                phone_trombone: 'string',
                phone_cornet: {type: 'string?', default: ''},
                hobby: 'string',
                speciality: 'string',
                synopsis: 'string',
                remark: {type: 'string?', default: ''}
            };
            this.validate(rule,this.ctx.request.body);
            this.ctx.request.body.acm_id = this.ctx.session.userId;
            await this.service.acm.acm.createAcmUser(this.ctx.request.body);
            this.success();
        }
        catch (error) {
            this.handleError(error);
        }
    }
}

module.exports = CommentController;
