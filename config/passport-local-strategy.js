const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      // find the user and establish the identity
      User.findOne({ email: email })
        .then((user) => {
          if (!user || password !== user.password) {
            console.log("Invalid username/password");
            return done(null, false);
          } else {
            return done(null, user);
          }
        })
        .catch((error) => {
          console.log("Error in finding the user -> Passport");
          return done(error);
        });
    }
  )
);

// check if the user is authenticated
passport.checkAuthentication = (request, response, next) => {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (request.isAuthenticated()) {
    return next();
  }
  return response.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = (request, response, next) => {
  if (request.isAuthenticated()) {
    // request.user contains the current signed in user from the session cookie and we are just sending it to the locals for the views
    response.locals.user = request.user;
  }
  next();
};
// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
  return done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((error) => {
      console.log("Error in finding the user -> Passport");
      return done(error);
    });
});

module.exports = passport;
