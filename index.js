const express = require("express");
const expressLayout = require("express-ejs-layouts");
const router = require("./routes");
const app = express();
const port = 8000;

app.use(expressLayout);

// Extracting the styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(express.static("./assets"));
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
