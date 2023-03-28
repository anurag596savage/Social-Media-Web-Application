var mongoose = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

module.exports.create = async (request, response) => {
  /*
  Post.create({
    content: request.body.content,
    user: request.user._id,
  })
    .then((post) => {
      request.flash("success", "Post created successfully!");
      return response.redirect("back");
    })
    .catch((error) => {
      request.flash("error", "Post could not be created!");
      return response.redirect("back");
    });
    */
  try {
    let post = await Post.create({
      content: request.body.content,
      user: request.user._id,
    });
    let signedInUser = await User.findById(request.user._id);
    let userName = signedInUser.name;
    if (request.xhr) {
      return response.status(200).json({
        data: {
          post: post,
          name: userName,
        },
        message: "Post created!",
      });
    }
    request.flash("success", "Post created successfully!");
    return response.redirect("back");
  } catch (error) {
    request.flash("error", "Post could not be created!");
    return response.redirect("back");
  }
};

module.exports.destroy = (request, response) => {
  Post.findById(request.params.id)
    .then((post) => {
      // .id means converting the object id into string
      if (post.user == request.user.id) {
        Post.deleteOne({ _id: request.params.id })
          .then(() => {
            console.log("Successfully deleted the post!");
          })
          .catch((error) => {
            request.flash("error", "Could not delete the post!");
            return response.redirect("back");
          });
        Comment.deleteMany({ post: request.params.id })
          .then(() => {
            console.log("Comments related to post successfully deleted!");
          })
          .catch((error) => {
            console.log("Comments related to post could not deleted!");
          });
        if (request.xhr) {
          return response.status(200).json({
            data: {
              post_id: request.params.id,
            },
            message: "Post deleted!",
          });
        }
      }
      return response.redirect("back");
    })
    .catch((error) => {
      console.log("Could not find the post!");
      return response.redirect("back");
    });
};
