const nodemailer = require("../config/nodemailer");

module.exports.resetPassword = (reset_password_token) => {
  console.log("Inside reset_password_mailer.js");
  let htmlString = nodemailer.renderTemplate(
    {
      token: reset_password_token.accessToken,
      user: reset_password_token.user,
    },
    "/password/reset_password.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: "anurag596savage@gmail.com",
      to: reset_password_token.user.email,
      subject: "Reset your Password!",
      html: htmlString,
    },
    (error, info) => {
      if (error) {
        console.log("Error in sending mail: ", error);
        return;
      }
      console.log("Reset Password link sent: ", info);
    }
  );
};
