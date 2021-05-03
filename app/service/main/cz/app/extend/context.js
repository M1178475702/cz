const RESULT = Symbol('context#result');
const IS_INTERNAL = Symbol('context#is_internal');
module.exports = {

    get isInternal(){
        return this[IS_INTERNAL];
    },

    beInternal(){
        this[IS_INTERNAL] = true;
    },

    async getTransaction() {
        if (!this.transaction){
            this.transaction = {
                quote:1,
                t: await this.model.transaction(),
                end: false
            };
        }
        else if(!this.transaction.end)
            ++this.transaction.quote;
        else if(this.isInternal){
            //renew
            this.transaction = {
                quote:1,
                t: await this.model.transaction(),
                end: false
            };
        }
        return this.transaction.t;
    },

    async rollback(){
        if(!this.transaction)
            throw new ReferenceError('transaction is undefined');
        else if(!this.transaction.end && this.transaction.quote > 0){
            --this.transaction.quote;
            if(this.transaction.quote === 0){
                await this.transaction.t.rollback();
                this.transaction.end = true;
            }
        }
        else if(this.transaction.end)
            this.logger.error('事务已经提交')
    },

    async commit(){
        if(!this.transaction)
            throw new ReferenceError('transaction is undefined');
        else if(!this.transaction.end && this.transaction.quote > 0){
            --this.transaction.quote;
            if(this.transaction.quote === 0){
                await this.transaction.t.commit();
                this.transaction.end = true;
            }
        }
        else if(this.transaction.end)
            this.logger.error('事务已经提交')
    },

    get result(){
        if(!this[RESULT]){
            this[RESULT] = this.app.constant.GET_API_RESULT_MODEL();
        }
        return this[RESULT];
    },

    validate(rule, data) {
        const errors = this.app.validator.validate(rule, data);
        if (errors) {
            if (errors[0].code === 'invalid')
                throw new this.app.error.InvalidError(`无效：${errors[0].field}`);
            else if (errors[0].code === 'missing_field')
                throw new this.app.error.PropertyRequiredError(`${errors[0].field}`)
        }
    },

    success(prompt){
        this.result.msg.prompt = prompt || '操作成功';
        this.result.retcode = this.app.constant.API_RESULT_STATUS.SUCCESS;
        this.body = this.result;
    },

    handleError(error) {
        if(this.isInternal){
            this.handleInternalError(error);
        }
        else {
            this.result.retcode = error.err_code || this.app.constant.API_RESULT_STATUS.SERVER_ERROR;
            if(error instanceof this.app.error.CommonError)
                this._commonError(error);
            else if(error instanceof this.app.error.InternalCommonError)
                this._internalCommonError(error);
            else if(error instanceof this.app.error.PermissionError)
                this._permissionError(error);
            else if (error instanceof this.app.error.ValidationError)
                this._dataError(error);
            else if (error instanceof this.app.error.SequelizeBaseError)
                this._databaseError(error);
            else if(error instanceof this.app.error.ServerError)
                this._internalError(error);
            else if (error instanceof Error)
                this._internalError(error);
            else
                this._internalError(new Error('Unknown error'), '未知错误');
        }
    },

    handleInternalError(error){
        this.logger.error(error);
    },

    _commonError(error){
        this.result.msg.prompt = error.message;
        this.body = this.result;
    },

    _permissionError(error) {
        this.result.msg.prompt = error.message;
        this.body = this.result;
    },

    _dataError(error) {
        this.logger.error(error);
        this.result.msg.error = error.message;
        this.result.msg.prompt = '不好意思出错了';
        this.body = this.result;
    },

    _databaseError(error) {
        this.logger.error(error);
        this.result.msg.error = error.message;
        this.result.msg.prompt = '不好意思出错了';
        this.body = this.result;
    },

    _internalError(error) {
        this.logger.error(error);
        this.result.msg.error = error.message;
        this.result.msg.prompt = '不好意思出错了';
        this.result.retcode = this.app.constant.API_RESULT_STATUS.SERVER_ERROR;
        this.body = this.result;
    },

    _internalCommonError(error){
        this.logger.error(error);
        this.result.msg.error = error.message;
        this.result.msg.prompt = '系统错误，请向管理员反馈';
        this.body = this.result;
    }
};
