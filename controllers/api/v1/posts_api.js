const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async (request, response) => {
  const posts = await Post.find().sort("-createdAt").populate("user").populate({
    path: "comments",
    populate: "user",
  });

  return response.status(200).json({
    message: "List of posts",
    posts: posts,
  });
};

module.exports.destroy = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post.user == request.user.id) {
      await Post.findByIdAndDelete(request.params.id);
      await Comment.deleteMany({ post: request.params.id });
      return response.status(200).json({
        message: "Post and related comments deleted successfully",
      });
    } else {
      return response.status(401).json({
        message: "You cannot delete the post!",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.get = async (request, response) => {
  try {
    const postId = request.params.id;
    const post = await Post.findById(postId);
    return response.status(200).json({
      message: "Post details",
      post: post,
    });
  } catch (error) {
    console.log("Error:", error);
    return response.status(200).json({
      message: "Internal Server Error",
    });
  }
};
