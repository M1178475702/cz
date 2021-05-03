const constant = require('../../common/constant/common-constant');

class ValidationError extends Error{
    constructor(message){
        super(message);
        this.name = 'ValidationError';
        this.err_code = constant.API_RESULT_STATUS.DATA_ERROR;
    }
}

class PropertyRequiredError extends ValidationError{
    constructor(argument){
        super(`缺少参数 : ${argument}`);
        this.name = 'PropertyRequiredError';
    }
}

class InvalidError extends ValidationError {
    constructor(argument){
        super(`${argument}`);
        this.name = 'InvalidError';
    }
}

class PermissionError extends Error{
    constructor(resource){
        super(`${resource}`);
        this.name = 'PermissionError';
        this.err_code = constant.API_RESULT_STATUS.PERMISSION_ERROR;
    }
}

class ServerError extends Error{
    constructor(resource){
        super(`${resource}`);
        this.name = 'PermissionError';
        this.err_code = constant.API_RESULT_STATUS.SERVER_ERROR;
    }
}

//业务错误
class CommonError extends Error{
    constructor(message){
        super(message);
        this.name = 'CommonError';
        this.err_code = constant.API_RESULT_STATUS.COMMON_ERROR
    }
}

//内部业务错误，需要提醒管理员
class InternalCommonError extends Error{
    constructor(message){
        super(message);
        this.name = 'InternalCommonError';
        this.err_code = constant.API_RESULT_STATUS.INTERNAL_COMMON_ERROR;
    }
}

//与第三方通信时，由于第三方的原因，产生的错误
class NetworkError extends InternalCommonError{
    constructor(message){
        super(message);
        this.name = 'NetworkError';
    }
}

module.exports = {
    ValidationError: ValidationError,
    PropertyRequiredError: PropertyRequiredError,
    InvalidError: InvalidError,
    PermissionError:PermissionError,
    NetworkError: NetworkError,
    CommonError: CommonError,
    InternalCommonError: InternalCommonError,
    ServerError: ServerError,
    SequelizeBaseError: null,
};
