const express = require("express");
const app = express();
const port = 3000;
//require("dotenv").config();
//const db = require("./dbinit");

//the 2 lines below are for post and put requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
