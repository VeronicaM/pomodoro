const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");

const port = process.env.PORT || 80;

const routes = require("./routes/index");

const app = express();

if (process.env.NODE_ENV !== "development") {
  app.use("/public/assets/", express.static(path.join(__dirname, "build")));
}

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "jade");
app.use(favicon(`${__dirname}/public/favicon.png`));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", routes);

// Only load this middleware in dev mode (important).

if (process.env.NODE_ENV === "development") {
  const webpackMiddleware = require("webpack-dev-middleware"); // eslint-disable-line global-require
  const webpack = require("webpack"); // eslint-disable-line global-require
  const config = require("./webpack.config"); // eslint-disable-line global-require

  app.use(
    webpackMiddleware(webpack(config), {
      publicPath: '/',

      headers: { "X-Custom-Webpack-Header": "yes" },

      stats: {
        colors: true,
      },
    })
  );
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.listen(port, () => {
  console.log("listening on port ", port); // eslint-disable-line no-console
});
