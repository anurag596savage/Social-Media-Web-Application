const Post = require("../models/post");
const User = require("../models/user");
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
          path: "user",
        },
      });
    let users = await User.find({});
    return response.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (error) {
    console.log("Error : ", error);
  }
};
