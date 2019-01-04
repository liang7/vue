const argv = process.argv.slice(2);
const chalk = require('chalk');
const config = require("./config");
const devServer = require("./devServer");
const buildServer = require("./buildServer");
const baseWebpackConfig = require("./webpackConfig/base");

let args = {};
argv.forEach(function (item) {
    item = item.split("=");
    args[item[0]] = item.length === 1 ? true : item[1];
});

switch (process.env.npm_lifecycle_event) {

    //本地web服务
    case 'dev':
        devServer(baseWebpackConfig, config, args).catch(err => {
            console.log(chalk.red(err));
        });
        break;

    // 构建服务
    case 'build': case 'anaylz':
        buildServer(baseWebpackConfig, config, args).catch(err => {
            console.log(chalk.red(err));
        });
        break;

}