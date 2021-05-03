const {Controller} = require('egg');

class ApiController extends Controller {
    constructor(self) {
        super(self);
    }
    get result(){
        return this.ctx.result;
    }

    get constant() {
        return this.app.constant;
    }

    get error() {
        return this.app.error;
    }

    get helper(){
        return this.ctx.helper;
    }


    validate(rule, data) {
        this.ctx.validate(rule,data);
    };

    success(prompt) {
        this.ctx.success(prompt);
    }

    handleError(error, prompt) {
        this.ctx.handleError(error,prompt);
    }

}

module.exports = ApiController;
