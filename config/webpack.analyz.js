// webpack.analyz.js
const path = require('path');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 分析我们打包的代码
const prod = require('./webpack.prod');
// 从根目录开始
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = merge(prod, {
  output: {
    path: resolve('analyz')
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 避免每次启动都打开分析网站
      generateStatsFile: true
    })
  ]
});
