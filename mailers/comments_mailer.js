const nodemailer = require("../config/nodemailer");

module.exports.newComment = (comment) => {
  console.log("Inside comments_mailer.js");
  let htmlString = nodemailer.renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );
  nodemailer.transporter.sendMail(
    {
      from: "anurag596savage@gmail.com",
      to: comment.user.email,
      subject: "New Comment Published!",
      html: htmlString,
    },
    (error, info) => {
      if (error) {
        console.log("Error in sending mail: ", error);
        return;
      }
      console.log("Message sent: ", info);
    }
  );
};
