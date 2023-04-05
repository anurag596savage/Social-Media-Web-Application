const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");
const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");

module.exports.create = async (request, response) => {
  try {
    let post = await Post.findById(request.body.post);
    let comment = await Comment.create({
      content: request.body.content,
      post: request.body.post,
      user: request.user._id,
    });
    post.comments.push(comment);
    post.save();
    comment = await comment.populate("user");
    // commentsMailer.newComment(comment);
    let job = queue.create("emails", comment).save((error) => {
      if (error) {
        console.log("Error in creating queue: ", error);
        return;
      }
      console.log("Job enqueued: ", job.id);
    });
    if (request.xhr) {
      return response.status(200).json({
        data: {
          comment: comment,
          name: comment.user.name,
        },
        mesage: "Comment created!",
      });
    }
  } catch (error) {
    console.log("Error in creating comment: ", error);
    request.flash("error", "Comment could not be created!");
    return response.redirect("back");
  }
};

module.exports.destroy = async (request, response) => {
  /*
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
    */
  try {
    let comment = await Comment.findById(request.params.id);
    if (comment.user == request.user.id) {
      let postId = comment.post;
      await Comment.deleteOne({ _id: request.params.id });
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: request.params.id },
      });
      await Like.deleteMany({ likable: request.params.id, onModel: "Comment" });
      if (request.xhr) {
        return response.status(200).json({
          data: {
            comment_id: request.params.id,
          },
          message: "Comment deleted!",
        });
      }
      return response.redirect("back");
    }
  } catch (error) {
    console.log("Error in deleting the comment: ", error);
    request.flash("error", "Could not delete the comment!");
    return response.redirect("back");
  }
};
