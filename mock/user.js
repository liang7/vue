const USER = {
    "POST /weixin/common/login": {
        code: "M00000",
        data: {
            msg: "验证码为空",
            resultCode: "2"
        },
        msg: "成功"
    },
    "POST /weixin/user/logout": {
        resultCode: 0,
        msg: "退出登录成功",
        errorTimes: 0,
        maxErrorTimes: 10,
        token: null
    }
};
module.exports = USER;
