const Post = require("../models/post");
module.exports.home = (request, response) => {
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
  Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
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
