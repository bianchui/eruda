const webpack = require('webpack')

exports = require('./webpack.base')

exports.entry = './src/myindex';
exports.output.library = ['addLog'];
exports.output.filename = 'eruda.min.js'
exports.devtool = false
exports.plugins = exports.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      dead_code: true,
      pure_getters: true,
      warnings: false
    },
    mangle: {
      properties: {
        regex: /_$|^_|\$$/,
        reserved: [],
      },
    },
    output: {
      comments: false,
      ascii_only: true
    },
    //comments: /eruda v/
  }),
  new webpack.DefinePlugin({
    ENV: '"production"'
  }),
])

module.exports = exports
