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
};

const production = {
  name: "production",
};

module.exports = development;
