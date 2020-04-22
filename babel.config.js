const defaultPlugin = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: 3
    }
  ],
  '@babel/plugin-syntax-dynamic-import',
  [
    'import',
    {
      libraryName: 'antd',
      style: 'css' // `style: true` 会加载 less 文件
    }
  ]
];
if (process.env.NODE_ENV === 'development') {
  defaultPlugin.unshift('react-hot-loader/babel');
}
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: defaultPlugin
};
