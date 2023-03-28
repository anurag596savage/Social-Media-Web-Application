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

            if (request.xhr) {
              return response.status(200).json({
                data: {
                  comment: comment,
                },
                mesage: "Comment created!",
              });
            }

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

module.exports.destroy = (request, response) => {
  Comment.findById(request.params.id)
    .then((comment) => {
      if (comment.user == request.user.id) {
        let postId = comment.post;
        Comment.deleteOne({ _id: request.params.id })
          .then(() => {
            console.log("Successfully deleted the comment");
          })
          .catch((error) => {
            console.log("Error in deleting the comment");
          });
        Post.findByIdAndUpdate(postId, {
          $pull: { comments: request.params.id },
        })
          .then((post) => {
            console.log("Successfully deleted the comment from post");
          })
          .catch((error) => {
            console.log("Error in deleting the comment from post");
          });
        if (request.xhr) {
          return response.status(200).json({
            data: {
              comment_id: request.params.id,
            },
            message: "Comment deleted!",
          });
        }
      }
      response.redirect("back");
    })
    .catch((error) => {
      console.log("Error in finding the comment");
    });
};
