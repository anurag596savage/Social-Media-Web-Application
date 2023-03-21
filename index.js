const express = require("express");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // used for session cookie
const passport = require("passport");
const router = require("./routes");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo")(session);

const port = 8000;

const db = require("./config/mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayout);

// Extracting the styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.static("./assets"));

app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the database
app.use(
  session({
    name: "Codeial",
    // TODO - Change the secret before deployment in production mode
    secret: "something",
    saveUnitialized: false,
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

// For any further routes access from here
app.use("/", router);

app.listen(port, (error) => {
  if (error) {
    console.log(`Error in running the server : ${error}`);
    return;
  }
  console.log(`Server is up and running on port : ${port}`);
});
