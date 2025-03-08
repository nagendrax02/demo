const { merge } = require('webpack-merge');
const prodConfig = require('./rspack.prod.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(prodConfig, {
  output: {
    chunkFilename: '[name].js',
  },
  plugins: [
    {
      name: 'rspack-bundle-analyzer',
      apply(compiler) {
        new BundleAnalyzerPlugin({
          generateStatsFile: true,
          analyzerMode: process.env.APP_ENV == 'CICD' ? 'json' : 'server'
        }).apply(compiler);
      }
    }
  ]
});
