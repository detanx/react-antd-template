// webpack.dev.js
const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common")

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: "./index.html",
    hot: true,
    port: 8080,
    open: true,
    inline: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify("dev"), // 字符串
      FLAG: "true" // FLAG 是个布尔类型
    }),
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
})
