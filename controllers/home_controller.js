module.exports.home = (request, response) => {
  // console.log(request.cookies);
  return response.render("home", {
    title: "Home",
  });
};
