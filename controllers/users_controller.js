module.exports.profile = (request, response) => {
  return response.render("./user_profile", {
    title: "User Profile",
  });
};
