const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async (request, response) => {
  try {
    let likable;
    let deleted = false;
    if (request.query.type == "Post") {
      likable = await Post.findById(request.query.id).populate("likes");
    } else {
      likable = await Comment.findById(request.query.id).populate("likes");
    }

    console.log(likable);

    // Check if a like already exists
    let existingLike = await Like.findOne({
      likable: request.query.id,
      onModel: request.query.type,
      user: request.user._id,
    });
    // If like already exists delete it
    if (existingLike) {
      console.log("Like already exists!");
      if (request.query.type == "Post") {
        await Post.findByIdAndUpdate(request.params.id, {
          $pull: { likes: existingLike._id },
        });
      } else {
        await Comment.findByIdAndUpdate(request.params.id, {
          $pull: { likes: existingLike._id },
        });
      }
      await Like.deleteOne({ _id: existingLike._id });
      deleted = true;
    } else {
      console.log("Creating a new like!");
      let newLike = await Like.create({
        user: request.user._id,
        likable: request.query.id,
        onModel: request.query.type,
      });
      likable.likes.push(newLike._id);
      console.log(likable);
      likable.save();
    }

    return response.status(200).json({
      data: {
        deleted: deleted,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
};
