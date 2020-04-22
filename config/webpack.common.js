// webpack.common.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html模板
const autoprefixer = require('autoprefixer');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

// 从根目录开始
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'), // 入口起点根目录
  entry: ['./src/index.js'],
  output: {
    path: resolve('build'),
    publicPath: '/',
    filename: '[name].[hash:5].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import'
              ]
            }
          },
          'eslint-loader'
        ]
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  autoprefixer({
                    overrideBrowserslist: ['>0.25%', 'not dead']
                  })
                ];
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|svg|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'static/font/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body'
    }),
    new AntdDayjsWebpackPlugin(),
    new webpack.ProvidePlugin({
      // 全局变量
      React: 'react',
      Component: ['react', 'Component'],
      PureComponent: ['react', 'PureComponent']
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  }
};
