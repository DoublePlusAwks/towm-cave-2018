/*
    ./webpack.config.js
*/
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /.*\.png$/i,
        loaders: [ 'file-loader', {
          loader: 'image-webpack-loader',
          query: {
            progressive: true,
            pngquant: {
              quality: '65-90',
              speed: 4
            }
          }
        }]
      },
      { test: /\.json$/, loader: 'json-loader', exclude: /node_modules/ },
    ]
  },
  plugins: [HtmlWebpackPluginConfig],
};
