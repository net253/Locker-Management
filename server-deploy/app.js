const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const logger = require("morgan");
const cors = require("cors");

const fethAuto = require("./routes/fetch-auto");
const minutes = 1;
fethAuto(minutes * 60 * 1000);

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const apiUserRouter = require("./routes/api-user");
const authRouter = require("./routes/auth");
const manageRouter = require("./routes/manage");
const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// APPLY COOKIE SESSION MIDDLEWARE
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    // maxAge: 3600 * 1000 // 1hr
    maxAge: 3600 * 30000000, // 1hr
  })
);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.redirect("/user"));

app.get("/admin*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/user*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/user.html"));
});

// app.get("/user*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/user.html"));
// });

// app.get("/logout", (req, res) => {
//   req.session = null;
//   res.redirect("/admin/");
// });

app.use("/index", indexRouter);
app.use("/api", apiRouter);
app.use("/api-user", apiUserRouter);
app.use("/auth", authRouter);
app.use("/manage", manageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
