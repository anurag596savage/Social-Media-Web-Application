const express = require("express");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = 8000;

const router = require("./routes");
const db = require("./config/mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayout);

// Extracting the styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.static("./assets"));

// For any further routes access from here
app.use("/", router);

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, (error) => {
  if (error) {
    console.log(`Error in running the server : ${error}`);
    return;
  }
  console.log(`Server is up and running on port : ${port}`);
});
