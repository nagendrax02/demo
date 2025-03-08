/**
 * @type {import('@rspack/core').Configuration}
 */
const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./rspack.common.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/'
  },
  devServer: {
    port: 4000,
    hot: true,
    static: {
      directory: path.join(__dirname, './'),
      serveIndex: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    open: true,
    compress: true
  },
  resolve: {
    alias: {
      // Added this to resolve preact version difference between swlite and nextgen components repo
      preact: path.resolve(__dirname, '../../node_modules/preact'),
      'preact/hooks': path.resolve(__dirname, '../../node_modules/preact/hooks'),
      'preact/compat': path.resolve(__dirname, '../../node_modules/@preact/compat')
    }
  }
});
