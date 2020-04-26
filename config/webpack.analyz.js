// webpack.analyz.js
const merge = require('webpack-merge');
const prod = require('./webpack.prod');

module.exports = merge(prod, {});
