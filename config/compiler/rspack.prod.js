/**
 * @type {import('@rspack/core').Configuration}
 */
const { merge } = require('webpack-merge');
const commonConfig = require('./rspack.common.js');
const { SwcCssMinimizerRspackPlugin, SwcJsMinimizerRspackPlugin } = require('@rspack/core');
const { rspack } = require('@rspack/core');

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    chunkFilename: '[contenthash:16].js'
  },
  optimization: {
    runtimeChunk: 'single',
    chunkIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](preact|wouter|zustand)[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/i,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  autoprefixer: { stage: 3 },
                  'postcss-nested': { preserveEmpty: true }
                }
              }
            }
          }
        ],
        type: 'css/module'
      }
    ]
  },
  plugins: [
    new rspack.SourceMapDevToolPlugin({
      publicPath: `https://${process.env.SOURCE_MAP_DOMAIN}/${process.env.APP_ENV}/`,
      filename: '[file].map'
    }),
    new SwcCssMinimizerRspackPlugin(),
    new SwcJsMinimizerRspackPlugin({ compress: { module: true } })
  ],
  experiments: {
    css: true
  }
});
