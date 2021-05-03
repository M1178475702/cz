/**
 * Created by Bakatora on 2019/4/13.
 */

const constant = {



    //文章状态码-数据库
    ARTICLE_STATUS: {
        DELETE: -3,             //（伪）删除
        DISAPPROVE: -2,         //审核不通过
        ACCESS_FORBIDDEN:-1,        //不可访问
        APPROVE_PENDING: 1,     //待审核
        APPROVED_FIRST: 2,        //一审通过
        APPROVED_SECOND: 3,        //二审通过
        DELAYED_PUBLISH: 4,     //延时发布
        PUBLISH: 5              //发布
    },

    //文章状态码-客户端
    ARTICLE_STATUS_CLIENT:{
        DELETE: 10001,             //（伪）删除
        DISAPPROVE: 10002,         //审核不通过
        ACCESS_FORBIDDEN: 10003,        //不可访问
        APPROVE_PENDING: 10004,     //待审核
        APPROVED_FIRST: 10005,        //一审通过
        APPROVED_SECOND: 10006,        //二审通过
        DELAYED_PUBLISH: 10007,     //延时发布
        PUBLISH: 10008              //发布
    },

    //将左表中的值，映射成右表中的值，键名要一致
    GET_CONSTANT_MAP(left,right,value){
        let result;
        for(let key in left){
            if(left[key] === value){
                result = right[key];
                break;
            }
        }
        return result;
    },

    //文章操作码
    ARTICLE_OPERATE_CODE: {
        DELETE: -4,             //（伪）删除
        DISAPPROVE_SECOND: -3,         //二审不通过
        DISAPPROVE_FIRST: -2,         //一审不通过
        ACCESS_FORBIDDEN:-1,        //不可访问
        APPROVED_FIRST: 1,        //一审通过
        APPROVED_SECOND: 2,       //二审通过
        DELAYED_PUBLISH: 3,      //延时发布
        PUBLISH: 4              //发布
    },
    //文章类型码
    ARTICLE_TYPE: {
        ALL: 0,       //全部
        CRAWLER: 1,   //爬虫
        REPRINT: 2,   //转载
        ORIGINAL: 3   //原创
    },

    //积分修改原因
    BONUS_POINTS_EDIT_REASON:{
        DAY_TASK_DO_ATTITUDE: 1,                    //每日任务-表达态度
        DAY_TASK_DO_SHARE: 2,                       //每日任务-分享
        DAY_TASK_SINGLE_READ_TIME_SPENT_20: 3,             //每日任务-完成单篇阅读任务20s
        DAY_TASK_DO_COMMENT: 4,                     //每日任务-评论
        DAY_TASK_TOTAL_READ_TIME_SPENT_20: 10,             //每日任务-完成总阅读任务20S（规定阅读时长）
        DAY_TASK_TOTAL_READ_TIME_SPENT_60: 11,          //每日任务-完成总阅读任务60S（规定阅读时长）
        DAY_TASK_CONSTANT_MAX: 30,
        PVIEWS_GREATER_10: 31,                      //阅读量超过10
        PVIEWS_GREATER_20: 32,                      //阅读量超过 20
        PVIEWS_GREATER_30: 33,                      //阅读量超过30
        TOTAL_READ_TIME_SPENT_GREATER_1000: 51,     //总阅读时长超过1000s
        TOTAL_READ_TIME_SPENT_GREATER_1500: 52,     //总阅读时长超过1500s
        TOTAL_READ_TIME_SPENT_GREATER_2000: 53      //总阅读时长超过2000s
    },

    //用户状态
    USER_STATUS:{
        REGISTERED: 1,                 //已注册
        AUTHENTICATED: 2              //认证
    },

    //用户角色 （是否要用表？）
    USER_ROLE:{
        UNKNOWN: 1,   //预留
        TEST:4,       //测试
        YOUKE:5,      //游客
        TEACHER: 10,         //教师
        STUDENT: 20,         //学生
        XD_STUFF: 30         //学到员工
    },

    //积分操作类型
    BONUS_POINTS_OP_TYPE:{
        INCREASE: 1,         //增加
        REDUCE: 2            //减少
    },

    //默认页大小
    DEFAULT_PAGE_SIZE: 10,
    //默认头像
    DEFAULT_USER_AVATAR: "http://api.hzxuedao.com/public/upload/image/2019/4/16/c58ee09eb77a448fb312598a5fe3a2a2.jpeg",

    //文章态度码
    ARTICLE_ATTITUDE: {
        NOTHING: 4,
        LIKE: 1,
        GENERAL: 2,
        UNLIKE: 3
    },

    LIKE_STATUS: {
        LIKE: 1,
        DISLIKE: 2
    },

    LIKE_ITEM_TYPE:{
        REPLY: 1
    },

    REPLY_ORIGIN_TYPE: {
        TOPIC: 1
    },

    //最大图片大小
    IMAGE_MAX_SIZE: 204800, //200kb
    //最大图片宽度
    IMAGE_MAX_WIDTH: 800,
    //评论状态
    COMMENT_STATUS: {
        DISAPPROVE: -1,
        APPROVE_PENDING: 1,
        APPROVED: 2
    },
    //收藏类型
    COLLECTION_TYPE:{
        ARTICLE: 1,
        FOLDER: 2,
        TOPIC: 3
    },
    //收藏状态
    COLLECTION_STATUS:{
        DO: 1,
        UNDO: 2
    },

    TOPIC_STATUS:{
        CAN_VIEW_COMMENT: 1,   //可以看可以评论
        CAN_VIEW_NOT_COMMENT: 2,          //只可以看
        NOT_CAN_VIEW_COMMENT: 3        //不可以看不可以评论
    },

    TOPIC_CREATOR_TYPE:{
        USER: 1,
        ADMIN: 2
    },

    //用户操作类型
    USER_OP_TYPE:{
        CLICK_ARTICLE_DETAIL_USER_CENTER: 10,                //文章详情内个人中心按钮点击
        CLICK_HEAT_ARTICLE_LIST: 11,                         //热文章点击
        JUMP_FROM_WEB_WX_DMT: 101,                           //跳转来自数媒公众号（网页）
        _1: 12,
        _2: 13,
        _3: 14,
        _4: 15,
        _5: 16,
        _6: 17,
        _7: 18,
        _8: 19,
        _9: 20,
        _10: 21,
        _11: 22,
        _12: 23,
        _13: 24,
        _14: 25,
        _15: 26,
        _16: 27,
        _17: 28,
        _18: 29,
        _19: 30,
        _20: 31,
        _21: 32,
        _22: 33,
        _23: 34,
        _24: 35,
        _25: 36,
        _26: 37,
        _27: 38,
        _28: 39,
        _29: 40,
        _30: 41,

    },
    //入口源
    SRC_TYPE:{
        WEB_WX_XD: 11,
        WEB_WX_DMT: 12
    },

    //配置表中的配置id
    CONFIG_ID: {

    },

    RED_PACK_AMOUNT_STRATEGY: {
        RANDOM: 1,        //随机
        FIXED: 2          //固定
    },

    RED_PACK_STATUS: {
        ENABLE: 1,   //启用
        DISABLE: 2,  //禁用（暂停）
        DRAIN: 3,    //耗尽
        END: 4       //结束
    },

    RED_PACK_TYPE: {
        COMMON: 1,    //普通
        FISSION: 2    //裂变
    },

    RED_PACK_SEND_ERR_CODE: {
        NONE: 0,
        AWAIT: 10,
        USER_ERROR: 20,
        ACCOUNT_ERROR: 30,
        INTERNAL_ERROR: 40
    }


};


Object.assign(constant,require('./common-constant'));
module.exports = constant;
