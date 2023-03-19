const express = require("express");
const app = express();
const port = 8000;

app.listen(port, (error) => {
  if (error) {
    console.log(`Error in running the server : ${error}`);
    return;
  }
  console.log(`Server is up and running on port : ${port}`);
});
