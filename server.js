const express = require('express');
const path = require('path');
const logger = require('morgan');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const port = process.env.PORT || 80;
const favicon = require('serve-favicon');

const app = express();

if (process.env.NODE_ENV !== 'development') {
  app.use('/public/assets/', express.static(path.join(__dirname, 'build')));
}

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(favicon(`${__dirname}/public/favicon.png`));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);

// Only load this middleware in dev mode (important).

if (process.env.NODE_ENV === 'development') {
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');

  const config = require('./webpack.config');

  app.use(
    webpackMiddleware(webpack(config), {
      publicPath: '/public/assets/',

      headers: { 'X-Custom-Webpack-Header': 'yes' },

      stats: {
        colors: true,
      },
    }),
  );
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const server = app.listen(port, () => {
  console.log('listening on port ', port);
});
