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

//the error handler needs to be fixed, the code is working but a time out error is logged anyway
app.get("/", (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error("your request has timed out ond results were not found");
    } catch (err) {
      next(err);
    }
  }, 1000);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
