const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_callback_url,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          console.log(profile);
          if (user) {
            return done(null, user);
          } else {
            User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            })
              .then((user) => {
                return done(null, user);
              })
              .catch((error) => {
                console.log(
                  "Error in creating user using passport-google-strategy: ",
                  error
                );
              });
          }
        })
        .catch((error) => {
          console.log(
            "Error in finding user using passport-google-strategy: ",
            error
          );
        });
    }
  )
);

module.exports = passport;
