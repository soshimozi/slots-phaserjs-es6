/**
 * Created by Monkey on 9/7/2017.
 */
var path = require('path')
var webpack = require('webpack')

var phaserModule = path.join(__dirname, '/node_modules/phaser')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var HtmlWebpackPlugin = require('html-webpack-plugin')

var pkg = require('./package.json')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },
  devtool: 'cheap-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      pkg: pkg,
      template: path.join(__dirname, 'index.html')
    })
  ],
  module: {
    rules: [
      {test: /\.js%/, use: ['babel-loader'], include: path.join(__dirname, 'src')},
      {test: /pixi\.js/, use: ['expose-loader?PIXI']},
      {test: /phaser-split\.js/, use: ['expose-loader?Phaser']},
      {test: /p2\.js/, use: ['expose-loader?p2']},
      {test: /\.(png|svg|jpg|gif|json)$/, use: ['file-loader']},
      {test: /\.(mp3|ogg)$/, loader: 'url-loader?limit=1000'}
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
