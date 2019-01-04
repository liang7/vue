const path = require('path');

module.exports = {
    // 端口
    port: 8080,
    // 代理
    proxy: {
        "/douban/": {
            target: "https://movie.douban.com/",
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '/douban': '' //需要rewrite的,
            }
        },
        "/j/*": {
            target: "https://m.douban.com/",
            ws: true,
            changeOrigin: true
        },
        "/rexxar/*": {
            target: "https://m.douban.com/",
            ws: true,
            changeOrigin: true
        },
        "/view/*": {
            target: "https://img3.doubanio.com/",
            ws: true,
            changeOrigin: true
        }
    },
    path: {
        src: path.resolve(__dirname, '../src'),
        public: path.resolve(__dirname, '../public'),
        dist: path.resolve(__dirname, '../dist'),
        outputPublicPath: '/'
    }
};
