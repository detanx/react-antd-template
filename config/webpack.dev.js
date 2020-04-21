// webpack.dev.js
const webpack = require('webpack');
const merge = require('webpack-merge');
// const path = require('path');
// const apiMocker = require('mocker-api');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    port: 8080,
    host: '0.0.0.0',
    open: true,
    inline: true,
    // before(app) {
    //   apiMocker(app, path.resolve('./mock/mocker.js'));
    // },
    proxy: {
      '/stockserver': {
        target: 'http://192.168.10.60:8080',
        changeOrigin: true,
        secure: false
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify('dev'), // 字符串
      FLAG: 'true' // FLAG 是个布尔类型
    }),
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
});
