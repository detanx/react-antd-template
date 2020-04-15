// webpack.prod.js
const webpack = require("webpack")
const merge = require("webpack-merge")
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // css拆分
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // 每次打包清除上一次
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") // css压缩
const TerserJSPlugin = require("terser-webpack-plugin")
const Uglify = require("uglifyjs-webpack-plugin")
const common = require("./webpack.common")

module.exports = merge(common, {
  mode: "production",
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production"), // 字符串
      FLAG: "true" // FLAG 是个布尔类型
    }),
    new Uglify(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css", // 打包到static的css目录下
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ]
})
