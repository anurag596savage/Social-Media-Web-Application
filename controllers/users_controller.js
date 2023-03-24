const User = require("../models/user");

module.exports.profile = (request, response) => {
  User.findById(request.params.id)
    .then((user) => {
      return response.render("./user_profile", {
        title: "User Profile",
        profile_user: user,
      });
    })
    .catch((error) => {
      console.log("Error in finding the profile");
    });
};

module.exports.signUp = (request, response) => {
  if (request.isAuthenticated()) {
    return response.redirect("/users/profile");
  }
  return response.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

module.exports.signIn = (request, response) => {
  if (request.isAuthenticated()) {
    return response.redirect("/users/profile");
  }
  return response.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

// Get the Sign up data
module.exports.create = (request, response) => {
  if (request.body.password !== request.body.confirm_password) {
    return response.redirect("back");
  }
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        User.create(request.body)
          .then((user) => {
            return response.redirect("/users/sign-in");
          })
          .catch((error) => {
            console.log("Error in creating user while signing up!");
            return;
          });
      } else {
        return response.redirect("back");
      }
    })
    .catch((error) => {
      console.log("Error in finding user while signing up!");
      return;
    });
};

//  Sign in and create the session
module.exports.createSession = (request, response) => {
  return response.redirect("/");
};

module.exports.destroySession = function (request, response, next) {
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    return response.redirect("/");
  });
};

module.exports.update = (request, response) => {
  if (request.user.id == request.params.id) {
    User.findByIdAndUpdate(request.params.id, request.body)
      .then((user) => {
        response.redirect("back");
      })
      .catch(() => {
        console.log("Error in updating the details of the user!");
      });
  } else {
    return response.status(401).send("Unauthorised");
  }
};
