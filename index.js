const express = require("express");
const router = require("./routes");
const app = express();
const port = 8000;

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
