const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
module.exports.createSession = async (request, response) => {
  try {
    let user = await User.findOne({ email: request.body.email });
    if (!user || user.password != request.body.password) {
      return response.status(422).json({
        message: "Invalid username/password",
      });
    }
    return response.status(200).json({
      message: "Signed in successfully, keep your token safe!",
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret, {
          expiresIn: "1000000",
        }),
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
};
