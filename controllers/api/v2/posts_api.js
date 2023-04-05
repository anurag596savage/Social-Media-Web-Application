module.exports.index = (request, response) => {
  return response.status(200).json({
    message: "List of posts inside v2",
    posts: [],
  });
};
