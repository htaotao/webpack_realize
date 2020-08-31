// 引入配置
const options = require("./webpack.config")

const Complier = require("./lib/complier")

new Complier(options).run()