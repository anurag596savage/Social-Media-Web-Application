const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "/assets",
  session_cookie_key: "something",
  db: "codeial_development",
  smtp: {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "anurag596savage@gmail.com",
      pass: "dedrwndmqxqelxwf",
    },
  },
  google_client_id:
    "1005553232600-0tja5c26tfv5up93d76egkoqfca0trma.apps.googleusercontent.com",
  google_client_secret: "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",
  google_callback_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codeial",
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

// console.log(process.env);

const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSETS_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

// module.exports = development;

module.exports =
  eval(process.env.CODEIAL_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.CODEIAL_ENVIRONMENT);
