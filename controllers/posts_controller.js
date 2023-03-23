const Post = require("../models/post");

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
