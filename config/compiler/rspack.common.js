/**
 * @type {import('@rspack/core').Configuration}
 */
const path = require('path');
const rspack = require('@rspack/core');
const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');

module.exports = {
  entry: './src/index.tsx',
  devtool: false,
  output: {
    path: path.resolve('./build'),
    filename: '[name].[contenthash].js',
    publicPath: 'auto',
    crossOriginLoading: false,
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json'],
    tsConfigPath: path.resolve(__dirname, '../../tsconfig.json'),
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  target: 'web',
  plugins: [
    new rspack.HtmlRspackPlugin({ template: 'public/index.html' }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: './src/assets',
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store']
          },
          noErrorOnMissing: true
        },
        {
          from: './public',
          to: '.',
          globOptions: {
            ignore: ['*.DS_Store', '**/index.html']
          },
          noErrorOnMissing: true
        }
      ]
    }),
    // process.env.RSDOCTOR check is used to control whether the RsdoctorRspackPlugin should be registered and configured. RsdoctorRspackPlugin may add extra build time due to additional features or analysis (such as tracking loaders, plugins, bundles, or resolvers).
    process.env.RSDOCTOR &&
      new RsdoctorRspackPlugin({
        features: ['loader', 'plugins', 'bundle', 'resolver'],
        supports: {
          parseBundle: true,
          generateTileGraph: true
        },
        mode: 'brief'
      })
  ].filter(Boolean),
  module: {
    generator: {
      'css/module': {
        exportsConvention: 'as-is',
        localIdentName: '[hash:16]'
      }
    },
    parser: {
      'css/module': {
        namedExports: false
      }
    },
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: 'typescript'
            }
          }
        },
        type: 'javascript/auto'
      },
      {
        test: /\.tsx$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true
              },
              transform: {
                react: {
                  pragma: 'React.createElement',
                  pragmaFrag: 'React.Fragment',
                  throwIfNamespace: true,
                  development: false,
                  useBuiltins: false,
                  runtime: 'automatic'
                }
              }
            }
          }
        },
        type: 'javascript/auto'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      },
      {
        test: /\.png|.jpg|.svg|.gif/,
        type: 'asset/resource'
      },
      {
        test: /\.module\.css$/i,
        type: 'css/module'
      }
    ]
  }
};
