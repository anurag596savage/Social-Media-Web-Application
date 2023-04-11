const express = require("express");
const env = require("./config/environment");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // used for session cookie
const passport = require("passport");
const router = require("./routes");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");
const path = require("path");
const logger = require("morgan");

const port = 8000;

const db = require("./config/mongoose");

const app = express();

// setup the chat server to be used with server.io
const chatServer = require("http").Server(app);
const chatSocket = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(3000, (error) => {
  if (error) {
    console.log("Error in connecting to chatServer: ", error);
    return;
  }
  console.log("The chatServer is running on port : 3000");
});

if (env.name == "development") {
  console.log("In development mode!");
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "/scss"),
      dest: path.join(__dirname, env.asset_path, "/css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayout);

// Extracting the styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.static(path.join(__dirname, env.assets_path)));
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the database
app.use(
  session({
    name: "Codeial",
    // TODO - Change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      (error) => {
        console.log(error || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

// For any further routes access from here
app.use("/", router);

app.listen(port, (error) => {
  if (error) {
    console.log(`Error in running the server : ${error}`);
    return;
  }
  console.log(`Server is up and running on port : ${port}`);
});
