'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: process.env.NODE_ENV === 'production' ? {
          presets: [
            ['babel-preset-env', {
              targets: {
                browsers: ['> 1%', 'last 2 versions']
              }
            }]
          ]
        } : {},
        include: process.env.NODE_ENV === 'production' ? [resolve('src'),
          resolve('node_modules/webpack-dev-server/client'),
          resolve('node_modules/ipfs-api'),
          resolve('node_modules/ipfs-unixfs/src'),
          resolve('node_modules/ipfs-utils/src'),
          resolve('node_modules/ipld-dag-pb'),
          resolve('node_modules/ipld-dag-cbor/src'),
          resolve('node_modules/libp2p-crypto/src'),
          resolve('node_modules/libp2p-crypto-secp256k1'),
          resolve('node_modules/peer-info'),
          resolve('node_modules/multihashing-async'),
          resolve('node_modules/iso-url'),
          resolve('node_modules/cids'),
          resolve('node_modules/is-ipfs'),
          resolve('node_modules/ipfs-block/src'),
          resolve('node_modules/multibase'),
          resolve('node_modules/multicodec'),
          resolve('node_modules/multiaddr/src'),
          resolve('node_modules/polycrc'),
          resolve('node_modules/borc'),
          resolve('node_modules/multihashes'),
          resolve('node_modules/matrixjs-tx'),
          resolve('node_modules/es6-proxy-polyfill/src'),
          resolve('node_modules/aiman'),
          resolve('node_modules/class-is'),
          resolve('node_modules/peer-id')] : [resolve('src'), resolve('test'),
          resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.less/,
        loaders: ['style', 'css', 'sass', 'style-loader!css-loader!less-loader']
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
