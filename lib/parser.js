const fs = require("fs")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const path = require("path")
const {transformFromAst} = require("@babel/core")


module.exports = {
    getAst: (filename) => {
        const content = fs.readFileSync(filename, "utf-8")
        // console.log(content);
        return parser.parse(content, {
            sourceType: 'module'
        })
    },
    getDependcies: (ast, filename) => {
        const dependcies = {};
        traverse(ast,{
            ImportDeclaration({node}){           
                const newPath = path.join('./',path.dirname(filename), node.source.value)
                dependcies[node.source.value] = newPath
            }
        })
        return dependcies
    },
    getCode: (ast) => {
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        })
        return code
    }
}