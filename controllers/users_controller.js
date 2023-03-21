const User = require("../models/user");

module.exports.profile = (request, response) => {
  if (Object.keys(request.cookies).length === 0) {
    return response.redirect("/users/sign-in");
  } else {
    User.findById(request.cookies.user_id)
      .then((user) => {
        if (user) {
          return response.render("./user_profile", {
            title: "User Profile",
            user: user,
          });
        } else {
          return response.redirect("/users/sign-in");
        }
      })
      .catch((error) => {
        console.log("Error in finding the user_id!");
      });
  }
};

module.exports.signUp = (request, response) => {
  return response.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

module.exports.signIn = (request, response) => {
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
  /*
  Steps of authentication
  1. find the user
  2. handle the user found
  3. handle password which don't match
  4. handle session creation
  5. handle user not found
  */
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user) {
        if (user.password !== request.body.password) {
          return response.redirect("back");
        } else {
          response.cookie("user_id", user.id);
          return response.redirect("/users/profile");
        }
      } else {
        return response.direct("/users/sign-up");
      }
    })
    .catch((error) => {
      console.log("Error in finding the user while signing up");
    });
};

// Sign out and remove the cookies
module.exports.removeSession = (request, response) => {
  if (request.cookies.user_id) {
    response.clearCookie("user_id");
    return response.redirect("/users/sign-in");
  }
};
