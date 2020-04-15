// webpack.analyz.js
const path = require("path")
const merge = require("webpack-merge")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer") // 分析我们打包的代码
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // 每次打包清除上一次
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // css拆分
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") // css压缩
const TerserJSPlugin = require("terser-webpack-plugin")
const Uglify = require("uglifyjs-webpack-plugin")
const common = require("./webpack.common")
// 从根目录开始
function resolve(dir) {
  return path.join(__dirname, "..", dir)
}

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  output: {
    path: resolve("analyz")
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled", // 避免每次启动都打开分析网站
      generateStatsFile: true
    }),
    new Uglify(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css", // 打包到static的css目录下
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ]
})
