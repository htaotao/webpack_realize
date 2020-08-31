(function(graph){
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
            require('./src/index.js')

        })({"./src/index.js":{"dependcies":{"./hello.js":"src/hello.js"},"code":"\"use strict\";\n\nvar _hello = require(\"./hello.js\");\n\n// import a from './hello.js';\ndocument.write((0, _hello.say)('webpack'));"},"src/hello.js":{"dependcies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return \"hello \" + name;\n}"}})