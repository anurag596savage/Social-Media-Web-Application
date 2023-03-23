const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = (request, response) => {
  Post.findById(request.body.post)
    .then((post) => {
      if (post) {
        Comment.create({
          content: request.body.content,
          post: request.body.post,
          user: request.user._id,
        })
          .then((comment) => {
            post.comments.push(comment);
            post.save();

            return response.redirect("/");
          })
          .catch((error) => {
            console.log("Error in creating the comment for the post");
          });
      }
    })
    .catch((error) => {
      console.log("Error in finding the post for creating the comment");
    });
};
