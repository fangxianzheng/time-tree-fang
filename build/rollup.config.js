var babel = require('rollup-plugin-babel');
var {terser} = require('rollup-plugin-terser');
const path = require('path');
const resolve = function (filePath) {
    return path.join(__dirname, '..', filePath)
}
export default {
    input: resolve('src/time-tree.js'), // 入口文件
    output: { // 出口文件
        file: resolve('dist/bundle.js'),
        format: 'umd',
        name: 'timeTree'
    },
    plugins: [terser(), babel()]
};