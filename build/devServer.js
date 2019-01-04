/**
 * 本地web服务
 */
const path = require('path');
const config = require("./config");
const devConfig = require("./webpackConfig/dev");
const merge = require("webpack-merge");
const webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const osUtil = require("./util/os");
const host = '0.0.0.0';

module.exports = function (webpackConfig, config, args) {

    const devServer = {
        hot: true,
        // 内容路径
        contentBase: config.path.src,
        // gzip压缩
        compress: true,
        // 设置host,使可用本机IP访问
        host: host,
        // 端口
        port: config.port,
        // 设置headers
        headers: {
            // 'Content-Security-Policy': "default-src 'self'; img-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';"
        },
        // 代理
        proxy: config.proxy,

        historyApiFallback: true, // 如果为 true ，页面出错不会弹出 404 页面
        // api mocker
        // before(app) {
        //     apiMocker(app, path.resolve(__dirname, "../mock/proxy"));
        // }
    };

    return new Promise((resolve, reject) => {
        let openUri = `http://${osUtil.getIp()}:${config.port}`;
        let _config = merge(webpackConfig, devConfig);

        WebpackDevServer.addDevServerEntrypoints(_config, devServer);

        return new WebpackDevServer(webpack(_config), devServer).listen(config.port, host, (err, _stats) => {

            if (err) {
                return reject(err);
            } else {

                console.log('');
                console.log('--------------------------------------------------------------');
                console.log('|                  ', chalk.green(openUri));
                console.log('--------------------------------------------------------------');

                resolve();
            }
        });
    });
};
