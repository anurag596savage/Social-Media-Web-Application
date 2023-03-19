module.exports.home = (request, response) => {
  return response.render("home", {
    title: "Home",
  });
};
