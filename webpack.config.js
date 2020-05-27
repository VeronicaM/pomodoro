const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  context: path.resolve('public'),
  entry: ['./js/app.js'],
  output: {
    path: path.resolve('build/'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: 'public',
  },
  plugins: [
    new Dotenv(),
    new ExtractTextPlugin('styles.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './views/index.jade',
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'jshint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: path.resolve('public/vendor'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!autoprefixer-loader',
        }),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: path.resolve('public/css'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!autoprefixer-loader!sass-loader',
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000 }, // Convert images < 10k to base64 strings
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] },
          },
        ],
      },
      {
        test: /\.jade$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'jade-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.es6'],
  },
};
