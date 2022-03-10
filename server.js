const express = require("express");
const { PORT, MONDODB_URL, GMAIL_USERNAME } = require("./config/index.JS");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
var methodoverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const { connect } = require("mongoose");
const { join } = require("path");
const AuthRoute = require("./Route/auth");
const EmpSchma = require("./Model/Employee.js");

const passport = require("passport");
require("./middlewares/passport")(passport);
// import routs start hear
const router = require("./Route/employee.js");

// import routs ends hear
const app = express();

//! ==================database connection start hear===================
let databaseConnection = async () => {
  await connect(MONDODB_URL);
  console.log("DATABASE IS CONNECTED");
};
databaseConnection();

// !==================database connection end hear======================

//?=================== TEMPLATE ENGINE MIDDLEWARE START HEAR============
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//?=================== TEMPLATE ENGINE MIDDLEWARE END HEAR==============

//====================BUILT IN MIDDLEWARE START HEAR====================
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));

// !session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// connect flash middleware
app.use(flash());
//====================BUILT IN MIDDLEWARE END HEAR======================

// Handlebars Helper classes
Handlebars.registerHelper("trimString", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

// ?==============sewt global variable============
app.use(function (req, res, next) {
  app.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  app.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  app.locals.errors = req.flash("errors");
  app.locals.error = req.flash("error");
  app.locals.user = req.user || null;
  let userData = req.user || null;
  app.locals.finalData = Object.create(userData);
  app.locals.username = app.locals.finalData.username;
  next();
});

app.use("/employee", router);
app.use("/auth", AuthRoute);

app.post("/employee/create-emp", (req, res) => {
  console.log(req.body);
  res.send("ok");
});
// listen port

app.listen(PORT, err => {
  if (err) throw err;

  console.log(`app is runnig on ${PORT}`);
});
