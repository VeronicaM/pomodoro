const WebpackStrip = require('strip-loader');
const devConfig = require('./webpack.config.js');

const stripLoader = {
  test: [/\.js$/, /\.es6$/],
  exclude: /node_modules/,
  loader: WebpackStrip.loader('console.log', 'perfLog'),
};

devConfig.module.rules.push(stripLoader);

module.exports = devConfig;
