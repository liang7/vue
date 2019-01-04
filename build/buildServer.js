/**
 * 本地构建服务
 */
const prodConfig = require("./webpackConfig/prod");
const merge = require("webpack-merge");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const chalk = require('chalk');

module.exports = function (webpackConfig, config, args) {
    
    return new Promise((resolve, reject) => {
        // 计算时间
        function formatTime(millisecond) {
            let second = millisecond / 1000;
            let minute = Math.floor(second / 60);
            return `${ (minute?minute+'分':'')+ (second - minute * 60).toFixed(2)}秒`;
        }
    
        //可视化资源分析工具webpack-bundle-analyzer的使用
        if (args.anaylz) {
            prodConfig.plugins.push(new BundleAnalyzerPlugin());
        }
        // 开始时间
        let startTime = new Date().getTime();

        webpack(merge(webpackConfig, prodConfig), function (err, stats) {
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }));
            // 结束时间
            let endTime = new Date().getTime();
            let time = `耗时：${formatTime(endTime - startTime)}`;
            console.log('');
            console.log('---------------------------------');
            console.log('| ', chalk.green(time));
            console.log('---------------------------------');

            if (err) {
                return reject(err);
            } else {
                resolve();
            }
        });
    });
};