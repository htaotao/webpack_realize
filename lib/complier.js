// node核心模块fs
const fs = require("fs")
// const parser = require("@babel/parser")
// const traverse = require("@babel/traverse").default
const path = require("path")
// const {transformFromAst} = require("@babel/core")
const {getAst, getDependcies, getCode} = require('./parser')

module.exports = class Complier{
    constructor(options){
        // console.log(options);
        const {entry, output} = options;
        this.entry = entry;
        this.output = output;
        this.moduleInfo = []
    }
    // 拿到参数。执行，分析入口文件，index.js
    run(){
        const info = this.build(this.entry);
        this.moduleInfo.push(info);
        for(let i = 0; i< this.moduleInfo.length; i ++){
            const item = this.moduleInfo[i];
            const {dependcies} = item;
            if (dependcies) {
                for (let j in dependcies) {
                    this.moduleInfo.push(this.build(dependcies[j]))
                }
            }
        }
        // console.log(this.moduleInfo)
        const obj = {};
        this.moduleInfo.forEach((item) => {
            obj[item.filename] = {
                dependcies: item.dependcies,
                code: item.code
            }
        });
        //生成代码文件
        this.file(obj)
    }
    // 分析
    build(filename){
        let ast = getAst(filename)
        let dependcies = getDependcies(ast,filename)
        let code = getCode(ast)

        return {
            filename,
            dependcies,
            code
        }

        // // 分析入口
        // // console.log(filename)
        // const content = fs.readFileSync(filename, "utf-8")
        // // console.log(content);
        // const ast = parser.parse(content, {
        //     sourceType: 'module'
        // })
        // // 入口模块依赖路径
        // const dependcies = {};
        // traverse(ast,{
        //     ImportDeclaration({node}){
                
        //         const newPath = path.join('./',path.dirname(filename), node.source.value)
        //         dependcies[node.source.value] = newPath
        //     }
        // })
        // // console.log(dependcies)
        // // 入口模块的代码转换
        // const { code } = transformFromAst(ast, null, {
        //     presets: ['@babel/preset-env']
        // })
        // console.log(code)
    }
    // 文件生成
    file(code){
        // console.log(code);
        const  filePath = path.join(this.output.path, this.output.filename)
        console.log(filePath);
        
        const newCode = JSON.stringify(code) 

        const bundle = `(function(graph){
            function require(module){
                // 根据路径拿到对象的代码，eval
                function localRequire(relativePath){
                    // 处理好的路径，在项目中的路径
                    return require(graph[module].dependcies[relativePath])
                }

                var exports = {};

                (function(require, exports, code){
                    eval(code)
                })(localRequire, exports, graph[module].code)
                return exports;

            }
            require('${this.entry}')

        })(${newCode})`

        // 生成文件
        fs.writeFileSync(filePath, bundle, 'utf-8');

    }
}