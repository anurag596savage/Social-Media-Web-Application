const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");

module.exports.home = async (request, response) => {
  // console.log(request.cookies);
  /*
  Post.find({})
    .then((posts) => {
      return response.render("home", {
        title: "Codeial | Home",
        posts: posts,
      });
    })
    .catch((error) => {
      console.log("Error in finding the posts");
      return;
    });
};
*/
  // populate the user of each post
  /*
  Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .then((posts) => {
      User.find({})
        .then((users) => {
          return response.render("home", {
            title: "Codeial | Home",
            posts: posts,
            all_users: users,
          });
        })
        .catch((error) => {
          console.log("Error in finding the users");
        });
    })
    .catch((error) => {
      console.log("Error in finding the posts");
      return;
    });
    */
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
        },
      })
      .populate("likes");

    let users = await User.find({});
    let current_user;
    if (request.isAuthenticated()) {
      current_user = await User.findById(request.user._id).populate({
        path: "friends",
        populate: {
          path: "from_user to_user",
        },
      });
      console.log(current_user);
    }
    return response.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
      current_user: current_user,
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};
