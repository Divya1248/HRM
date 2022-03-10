const { Router } = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
let USERSCHEMA = require("../Model/Auth");
const router = Router();

/*HTTP GET method
@ACCESS PUblic
@url/auth/register*/
router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});

router.get("/login", (req, res) => {
  res.render("../views/auth/login", {});
});

/*HTTP GET method
@ACCESS private
@url/auth/logout*/
router.get("/logout", async (req, res) => {
  req.logout();
  req.flash("SUCCESS_MESSAGE", "successfully logged out");
  res.redirect("/auth/login", 302, {});
});

/*HTTP POST method
@ACCESS PUblic
@url/auth/register*/

router.post("/register", async (req, res) => {
  let { username, email, password, password1 } = req.body;
  let errors = [];
  if (!username) {
    errors.push({ text: "username is required" });
  }
  if (username.length > 6) {
    errors.push({ text: "username is greater than 6 characters" });
  }
  if (!email) {
    errors.push({ text: "email is required" });
  }
  if (!password) {
    errors.push({ text: "password is required" });
  }
  if (password !== password1) {
    errors.push({ text: "password is not match" });
  }
  if (errors.length > 0) {
    res.render("../views/auth/register", {
      errors,
      username,
      password,
      email,
      password1,
    });
  } else {
    let user = await USERSCHEMA.findOne({ email });
    if (user) {
      req.flash("ERROR_MESSAGE", "Email is already exist");
      res.redirect("/auth/register", 302, {});
    } else {
      let newUser = new USERSCHEMA({
        username,
        email,
        password,
      });
      bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err;
        console.log(salt);
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          console.log(hash);
          newUser.password = hash;
          await newUser.save();
          req.flash("SUCCESS_MESSAGE", "successfully register");
          res.redirect("/auth/login", 302, {});
        });
      });
    }
  }
});

/*HTTP POST method
@ACCESS PUblic
@url/auth/login*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/employee/emp-profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});
module.exports = router;
