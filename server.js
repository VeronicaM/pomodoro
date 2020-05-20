const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");

const port = process.env.PORT || 82;

const app = express();

app.use("/", express.static(path.join(__dirname, "build")));

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "jade");
app.use(favicon(`${__dirname}/public/favicon.png`));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.listen(port, () => {
  console.log("listening on port ", port); // eslint-disable-line no-console
});
