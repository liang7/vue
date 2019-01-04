/**
 * prod配置
 */
const path = require("path");
const webpack = require('webpack');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const config = require('../config');

// 压缩CSS和JS代码
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const commonOptions = {
    chunks: 'all',
    reuseExistingChunk: true
};

// 通过webpack-merge合入通用配置
module.exports = {
    // 模式=>https://webpack.docschina.org/concepts/mode/#src/components/Sidebar/Sidebar.jsx
    mode: "production",

    // 输出=>https://webpack.docschina.org/configuration/output/
    output: {
        // contenthash 若文件内容无变化，则contenthash 名称不变
        filename: "js/[name].[contenthash].js"
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                dll: {
                    name: 'dll',
                    // test: /[\\/]node_modules[\\/](vue|vue-router|axios)[\\/]/,
                    test: /[\\/]node_modules[\\/]/, 
                    ...commonOptions
                },
                // commons: {
                //     name: 'commons',
                //     minChunks: Math.ceil(pages.length / 3), // 至少被1/3页面的引入才打入common包
                //     ...commonOptions
                // },
                // polyfill: {
                //     test: /[\\/]node_modules[\\/](core-js|raf|@babel|babel)[\\/]/,
                //     name: 'polyfill',
                //     priority: 2,
                //     ...commonOptions
                // }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                extractComments: false, // 移除注释
                // 压缩js
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                // 压缩css
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: {
                        disable: true //一定要指定为true。否则的话该插件会把我们用autoprefix加好的前缀都移除掉（因为该插件觉得多余）
                    }
                }
            })
        ]
    },

    // 模块
    module: {
        rules: [
            // 处理sass|scss|css
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            // 处理less
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
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
                        name: "images/[name]-[hash:5].[ext]",
                        // 低于5K时，转成base64
                        limit: 1024 * 5
                    }
                }]
            },
            // 处理媒体文件
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: 'media/[name]-[hash:5].[ext]'
                    }
                }]
            },
            // 处理字体
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: 'fonts/[name]-[hash:5].[ext]'
                    }
                }]
            }
        ]
    },

    // 插件
    plugins: [
        // 打包前清理文件
        new CleanWebpackPlugin(["dist/**"], {
            root: path.resolve(__dirname, "../../")
        }),

        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        
        new LodashModuleReplacementPlugin(),

        // 分离css
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[name].[hash].css"
        })
    ],
    
    performance: {
        // 最大300k
        maxEntrypointSize: 300000
    }
};
