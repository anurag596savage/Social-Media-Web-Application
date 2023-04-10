const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const env = require("./environment");

let options = {
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

passport.use(
  new JWTStrategy(options, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload._id })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((error) => {
        console.log("Error in finding user from JWT");
      });
  })
);

module.exports = passport;
