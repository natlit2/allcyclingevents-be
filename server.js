const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./dbinit");
const events = require("./routes/eventRoute");

//the 2 lines below are for post and put requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//here we deside how the route would be called
app.use("/events", events);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
