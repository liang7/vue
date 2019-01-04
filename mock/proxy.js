const USER = require("./user");

const _proxy = process.env.proxy == "true";


let proxy = {};

if (_proxy) {
    proxy = {
        /**
         * 代理远程服务器联调
         */
        _proxy: {
            proxy: {
                "/douban/": {
                    target: "https://movie.douban.com/",
                    pathRewrite: {
                        '/douban': '' //需要rewrite的,
                    }
                },
                "/j/*": "https://m.douban.com/",
                "/rexxar/*": "https://m.douban.com/",
                "/view/*": "https://img3.doubanio.com/"
            },
            changeHost: true
        }
    };
} else {
    proxy = {
        /**
         * 用户相关api
         */
        ...USER
    };
}
module.exports = proxy;
