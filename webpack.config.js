// webpack.config.js

// webpack配置就是对象{}
const path = require("path")
module.exports = {
    // 定义入口
    entry: './src/index.js',
    // 输出结构
    output: {
        // 输出路径
        path: path.resolve(__dirname, 'dist'),
        // 输出文件名称
        filename: 'main.js'
    }
}