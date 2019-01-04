/**
 * 存入dev、prod通用配置
 */
const path = require('path');
const webpack = require('webpack');
// vue-loader 插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('../config');

module.exports = {
    // 入口
    entry: path.join(config.path.src, 'app.js'),
    
    output: {
        path: config.path.dist,
        // 设置生成的js路径为绝对路径，不设置此项，二级路由刷新会找不到静态资源
        publicPath: config.path.outputPublicPath
    },

    resolve: {
        extensions: ['.js', '.vue', '.scss', '.json', '.css'],
        alias: {
            '@': config.path.src,
        }
    },
    // 模块
    module: {
        rules: [
            // 处理js
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'cache-loader',
                    'babel-loader?cacheDirectory=true'
                ]
            },
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: ['vue-loader']
            }
        ]
    },
    // 插件
    plugins: [
        // 显示进度
        new webpack.ProgressPlugin(),

        // 添加VueLoaderPlugin，以响应vue-loader
        new VueLoaderPlugin(),

        // 复制favicon.ico
        new CopyWebpackPlugin([{
            from: path.join(config.path.public, 'favicon.ico'),
            to: path.join(config.path.dist, 'favicon.ico')
        }]),

        // 生成html
        new HtmlWebpackPlugin({
            template: path.join(config.path.public, 'index.html'),
            minify: { //打包后压缩
                removeComments: true, // 打包后删除注释
                collapseWhitespace: true // 打包后删除空格
            }
        })

    ]
};
