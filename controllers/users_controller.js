const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const ResetPasswordToken = require("../models/reset_password_token");
const resetPasswordMailer = require("../mailers/reset_password_mailer");
const crypto = require("crypto");
const Friendship = require("../models/friendship");

module.exports.profile = async (request, response) => {
  try {
    let profile_user = await User.findById(request.params.id);
    let sourceToDestination = await Friendship.findOne({
      from_user: request.user._id,
      to_user: request.params.id,
    });
    let destinationToSource = await Friendship.findOne({
      from_user: request.params.id,
      to_user: request.user._id,
    });
    let displayText;
    if (sourceToDestination || destinationToSource) {
      displayText = "Remove Friend";
    } else {
      displayText = "Add Friend";
    }
    return response.render("./user_profile", {
      title: "User Profile",
      profile_user: profile_user,
      displayText: displayText,
    });
  } catch (error) {
    console.log("Error in finding the profile");
  }
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
  request.flash("success", "Logged in successfully!");
  return response.redirect("/");
};

module.exports.destroySession = function (request, response, next) {
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    request.flash("success", "You have logged out successfully!");
    return response.redirect("/");
  });
};

module.exports.update = async (request, response) => {
  /*
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
  */
  try {
    if (request.user.id == request.params.id) {
      let user = await User.findById(request.params.id);
      User.uploadedAvatar(request, response, (error) => {
        if (error) {
          console.log("Multer Error: ", error);
          return;
        }
        user.name = request.body.name;
        user.email = request.body.email;
        if (request.file) {
          console.log(request.file);

          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
              console.log(user.avatar);
              console.log(".......................");
              fs.unlinkSync(
                path.join((__dirname, "..", user.avatar)),
                (error) => {
                  console.log("Could not delete the intended image");
                }
              );
              console.log("***********************");
            } else {
              console.log("Path of the image not found");
            }
          }

          // We have to save the path of the uploaded file into the avatar field in the user's
          user.avatar = User.avatarPath + "/" + request.file.filename;
        }
        user.save();
      });
      request.flash("success", "Updated the details successfully!");
      return response.redirect("back");
    } else {
      return response.status(401).send("Unauthorised");
    }
  } catch (error) {
    request.flash("error", "Could not update!");
    response.redirect("back");
  }
};

module.exports.resetPassword = async (request, response) => {
  try {
    const email = request.query.email;
    console.log(email);
    const user = await User.findOne({ email: email });
    let reset_password_token = await ResetPasswordToken.create({
      user: user._id,
      accessToken: crypto.randomBytes(20).toString("hex"),
      isValid: true,
    });
    reset_password_token = await reset_password_token.populate("user");
    resetPasswordMailer.resetPassword(reset_password_token);
    console.log(reset_password_token);
    return response.redirect("back");
  } catch (error) {
    console.log("Error in resetting the password: ", error);
  }
};

module.exports.newPassword = async (request, response) => {
  try {
    const token = request.params.token;
    const reset_password_token = await ResetPasswordToken.findOne({
      accessToken: token,
    });
    console.log("Inside the newPassword controller: ", reset_password_token);
    return response.render("new_password", {
      title: "Codeial | Reset Password",
      reset_password_token: reset_password_token,
    });
  } catch (error) {
    console.log("Error in finding the token in the database: ", error);
  }
};

module.exports.changePassword = async (request, response) => {
  try {
    const token = request.params.token;
    if (request.body.password == request.body.confirm_password) {
      let reset_password_token = await ResetPasswordToken.findOne({
        accessToken: token,
      });
      console.log("Inside changePassword controller: ", reset_password_token);
      let userId = reset_password_token.user;
      let user = await User.findById(userId);
      console.log(user);
      console.log("New password: ", request.body.password);
      let updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          password: request.body.password,
        },
        { new: true }
      );
      console.log("Password changed successfully: ", updatedUser);
      reset_password_token = await ResetPasswordToken.findOneAndUpdate(
        {
          accessToken: request.params.token,
        },
        {
          isValid: false,
        },
        {
          new: true,
        }
      );
      response.redirect("/");
    } else {
      response.redirect("back");
    }
  } catch (error) {
    console.log("Error in changing the password: ", error);
  }
};
