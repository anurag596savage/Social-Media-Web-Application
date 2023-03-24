var mongoose = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = (request, response) => {
  Post.create({
    content: request.body.content,
    user: request.user._id,
  })
    .then((post) => {
      return response.redirect("back");
    })
    .catch((error) => {
      console.log("Error in creating the post");
      return;
    });
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
            console.log("Error in deleting the post");
          });
        Comment.deleteMany({ post: request.params.id })
          .then(() => {
            console.log("Successfully deleted the comments for the post!");
            return response.redirect("back");
          })
          .catch((error) => {
            console.log("Error in deleting the comments related to a post");
          });
      }
      return response.redirect("back");
    })
    .catch((error) => {
      console.log("Error in finding the post");
    });
};
