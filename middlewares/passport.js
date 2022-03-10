const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const USERSCHEMA = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        let user = await USERSCHEMA.findOne({ email });
        //   checking user exist or not
        if (!user) {
          //    error handling-null
          done(null, false, { message: "user not exist" });
        } else {
          done(null, user, "successfully logged in");
        }

        //   match passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            done(null, false, { message: "password is not match" });
          }
        });
      }
    )
  );
};
// used to serialize thw user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// used to deserialize thw user
passport.deserializeUser(function (id, done) {
  USERSCHEMA.findById(id, function (err, user) {
    done(err, user);
  });
});
