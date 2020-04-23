// webpack.prod.js
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css拆分
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次打包清除上一次
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩
const TerserJSPlugin = require('terser-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          minSize: 50000,
          minChunks: 1,
          chunks: 'initial',
          priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
        },
        commons: {
          test: /[\\/]src[\\/]/,
          name: 'commons',
          minSize: 50000,
          minChunks: 2,
          chunks: 'initial',
          priority: -1,
          reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
        }
      }
    },
    minimizer: [
      new TerserJSPlugin({}),
      // 用来优化css文件的输出，默认使用cssnano
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.(le|c)ss$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true }, // 禁用掉cssnano对于浏览器前缀的处理
          mergeLonghand: false,
          discardComments: {
            removeAll: true // 移除注释
          }
        },
        canPrint: true
      })
    ]
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 500000, // 单个资源体积最大，超过会提示
    maxEntrypointSize: 500000,
    assetFilter(assetFilename) {
      // 只计算js文件的性能提示
      return assetFilename.endsWith('.js');
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify('production'), // 字符串
      FLAG: 'true' // FLAG 是个布尔类型
    }),
    new UglifyjsWebpackPlugin({
      uglifyOptions: {
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        extractComments: false, // 移除注释
        cache: true,
        compress: {
          warnings: false,
          drop_console: true, // console
          pure_funcs: ['console.log'] // 移除console
        }
      },
      parallel: true // 开启并行压缩，充分利用cpu
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css', // 打包到static的css目录下
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ]
});
