
const constant = {
    API_RESULT_MODEL: {
        "data": {
        },
        "msg": {
            "error": "",
            "prompt": ""
        },
        "retcode": 1
    },

    API_RESULT_STATUS: {
        SUCCESS: 1,                  //成功
        DATA_ERROR: -1,              //请求数据错误
        SERVER_ERROR: -500 ,         //服务器错误
        PERMISSION_ERROR: -403,      //沒有权限
        NO_LOGIN_ERROR: -401,         //沒有登录
        COMMON_ERROR: -2,           //业务错误
        INTERNAL_COMMON_ERROR: -3
    },


    GET_API_RESULT_MODEL: (code = 1)=>{
        return {
            "data": {
            },
            "msg": {
                "error": "",
                "prompt": ""
            },
            "retcode": code
        };
    },
};



module.exports = constant;
