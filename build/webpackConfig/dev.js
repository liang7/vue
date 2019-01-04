/**
 * dev配置
 */
// const apiMocker = require("webpack-api-mocker");
const path = require("path");
const webpack = require('webpack');
const config = require('../config');

// 通过webpack-merge合入通用配置
module.exports = {
    // 模式=>https://webpack.docschina.org/concepts/mode/#src/components/Sidebar/Sidebar.jsx
    mode: "development",

    watchOptions: {
        ignored: /node_modules/,
        // 默认300ms
        aggregateTimeout: 1000
    },

    // 模块
    module: {
        rules: [
            // 解析.sass|scss|css文件
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            // 解析less文件
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },
            // 处理图片
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: "[name].[ext]",
                        publicPath: path.join(config.path.dist, "/img")
                    }
                }]
            },
            // 处理媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: 'media/[name].[ext]'
                    }
                }]
            },
            // 处理字体
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devtool: "cheap-module-eval-source-map"
};
