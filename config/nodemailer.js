const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "anurag596savage@gmail.com",
    pass: "dedrwndmqxqelxwf",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    (error, template) => {
      if (error) {
        console.log("Error in rendering template: ", error);
        return;
      }
      mailHTML = template;
    }
  );

  return mailHTML;
};

module.exports = {
  transporter,
  renderTemplate,
};
